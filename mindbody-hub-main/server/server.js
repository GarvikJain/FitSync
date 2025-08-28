import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { config } from './config.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.server.frontendUrl,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'MindBody Hub Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Initialize Google OAuth2 client
let oauth2Client;
try {
  oauth2Client = new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri
  );
} catch (error) {
  console.error('Failed to initialize OAuth2 client:', error.message);
  // Create a dummy client for testing
  oauth2Client = {
    generateAuthUrl: () => 'https://accounts.google.com/o/oauth2/auth?client_id=test&redirect_uri=test',
    getToken: () => Promise.resolve({ tokens: { access_token: 'test' } }),
    setCredentials: () => {},
    refreshAccessToken: () => Promise.resolve({ credentials: { access_token: 'test' } })
  };
}

// In-memory token storage (use Redis in production)
const userTokens = new Map();

// Google Fit API service
const fitness = google.fitness('v1');

// Authentication routes
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.google.scopes,
    prompt: 'consent'
  });
  res.json({ authUrl });
});

app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    
    // Get user info
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    // Create JWT token
    const jwtToken = jwt.sign(
      { 
        userId: userInfo.data.id,
        email: userInfo.data.email,
        name: userInfo.data.name
      },
      config.server.jwtSecret,
      { expiresIn: '7d' }
    );
    
    // Store tokens
    userTokens.set(userInfo.data.id, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date
    });
    
    // Redirect to frontend with token
    res.redirect(`${config.server.frontendUrl}/auth-success?token=${jwtToken}`);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.redirect(`${config.server.frontendUrl}/auth-error`);
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, config.server.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Health data routes
app.get('/api/health/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userToken = userTokens.get(userId);
    
    if (!userToken) {
      return res.status(401).json({ error: 'User not authenticated with Google Fit' });
    }
    
    oauth2Client.setCredentials(userToken);
    
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    
    // Get daily steps
    const stepsResponse = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
        }],
        bucketByTime: { durationMillis: 86400000 }, // 24 hours
        startTimeMillis: startOfDay.getTime(),
        endTimeMillis: endOfDay.getTime()
      }
    });
    
    // Get calories burned
    const caloriesResponse = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.calories.expended',
          dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended'
        }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: startOfDay.getTime(),
        endTimeMillis: endOfDay.getTime()
      }
    });
    
    // Get heart rate (last 24 hours)
    const heartRateResponse = await fitness.users.dataSources.list({
      userId: 'me'
    });
    
    const heartRateDataSource = heartRateResponse.data.dataSource?.find(
      ds => ds.dataType.name === 'com.google.heart_rate.bpm'
    );
    
    let heartRateData = null;
    if (heartRateDataSource) {
      const heartRateDataset = await fitness.users.dataSources.datasets.get({
        userId: 'me',
        dataSourceId: heartRateDataSource.dataStreamId,
        datasetId: `${startOfDay.getTime()}-${endOfDay.getTime()}`
      });
      
      if (heartRateDataset.data.point && heartRateDataset.data.point.length > 0) {
        const latestPoint = heartRateDataset.data.point[heartRateDataset.data.point.length - 1];
        heartRateData = {
          value: latestPoint.value[0].fpVal,
          timestamp: latestPoint.startTimeNanos
        };
      }
    }
    
    // Get sleep data (last night)
    const sleepStart = new Date(startOfDay.getTime() - 24 * 60 * 60 * 1000);
    const sleepResponse = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.sleep.segment',
          dataSourceId: 'derived:com.google.sleep.segment:com.google.android.gms:merged'
        }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: sleepStart.getTime(),
        endTimeMillis: startOfDay.getTime()
      }
    });
    
    // Process and format data
    const steps = stepsResponse.data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
    const calories = caloriesResponse.data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0;
    
    let sleepDuration = 0;
    if (sleepResponse.data.bucket?.[0]?.dataset?.[0]?.point) {
      sleepDuration = sleepResponse.data.bucket[0].dataset[0].point.reduce((total, point) => {
        const duration = (parseInt(point.endTimeNanos) - parseInt(point.startTimeNanos)) / (1000 * 1000 * 1000 * 60); // Convert to minutes
        return total + duration;
      }, 0);
    }
    
    const healthSummary = {
      steps: {
        value: steps,
        goal: 10000,
        unit: 'steps'
      },
      calories: {
        value: Math.round(calories),
        goal: 2000,
        unit: 'kcal'
      },
      heartRate: heartRateData ? {
        value: Math.round(heartRateData.value),
        unit: 'bpm',
        timestamp: new Date(parseInt(heartRateData.timestamp) / 1000000)
      } : null,
      sleep: {
        value: Math.round(sleepDuration),
        goal: 480, // 8 hours in minutes
        unit: 'minutes'
      },
      lastSynced: new Date().toISOString()
    };
    
    res.json(healthSummary);
  } catch (error) {
    console.error('Health data fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch health data',
      details: error.message 
    });
  }
});

// Refresh token endpoint
app.post('/api/auth/refresh', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userToken = userTokens.get(userId);
    
    if (!userToken?.refresh_token) {
      return res.status(401).json({ error: 'No refresh token available' });
    }
    
    oauth2Client.setCredentials(userToken);
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    userTokens.set(userId, {
      ...userToken,
      access_token: credentials.access_token,
      expiry_date: credentials.expiry_date
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = config.server.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Google OAuth URL: http://localhost:${PORT}/auth/google`);
}).on('error', (error) => {
  console.error('❌ Server failed to start:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.error('Port 3001 is already in use. Please stop other services using this port.');
  }
});


