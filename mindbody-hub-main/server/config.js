import dotenv from 'dotenv';

dotenv.config();

export const config = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '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',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback',
    scopes: [
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read',
      'https://www.googleapis.com/auth/fitness.heart_rate.read',
      'https://www.googleapis.com/auth/fitness.sleep.read',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  },
  server: {
    port: process.env.PORT || 3002,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'mindbody-hub-secure-jwt-secret-2024',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  }
};


