# Google Fit Integration Setup Guide

## Overview
This guide will help you set up the Google Fit integration for the MindBody Hub application. The integration includes a secure backend service and a frontend widget that displays real-time health metrics.

## Features
- **OAuth 2.0 Authentication**: Secure Google Fit account connection
- **Real-time Health Metrics**: Steps, calories, heart rate, and sleep data
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful handling of API errors and authentication issues
- **Auto-refresh**: Automatic token refresh and data synchronization
- **Clean UI**: Modern, wellness-themed interface with progress indicators

## Prerequisites
- Node.js 18+ installed
- Google Cloud Console account
- Google Fit API enabled

## Setup Instructions

### 1. Google Cloud Console Setup

#### Create a New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for the project

#### Enable Google Fit API
1. Go to the [API Library](https://console.cloud.google.com/apis/library)
2. Search for "Google Fit API"
3. Click on "Google Fit API" and enable it

#### Create OAuth 2.0 Credentials
1. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback` (for development)
   - `https://yourdomain.com/auth/google/callback` (for production)
5. Copy the Client ID and Client Secret

### 2. Backend Server Setup

#### Install Dependencies
```bash
cd server
npm install
```

#### Environment Configuration
Create a `.env` file in the `server` directory:

```env
# Google Fit API Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret for session management
JWT_SECRET=your_secure_jwt_secret_here

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

#### Start the Backend Server
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### 3. Frontend Configuration

#### Environment Variables
Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001
```

#### Install Additional Dependencies
```bash
npm install
```

### 4. Running the Application

#### Start Both Services
1. **Backend** (in one terminal):
   ```bash
   cd server
   npm run dev
   ```

2. **Frontend** (in another terminal):
   ```bash
   npm run dev
   ```

#### Access the Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## Usage

### Connecting Google Fit
1. Navigate to the main dashboard
2. Find the "Google Fit Integration" widget
3. Click "Connect Google Fit"
4. Complete the OAuth flow in the popup window
5. Grant the required permissions

### Viewing Health Data
Once connected, the widget will display:
- **Daily Steps**: Progress towards 10,000 step goal
- **Calories Burned**: Daily calorie expenditure
- **Heart Rate**: Latest heart rate reading (if available)
- **Sleep Duration**: Last night's sleep data

### Features
- **Real-time Sync**: Click the refresh button to update data
- **Progress Indicators**: Visual progress bars for goals
- **Trend Icons**: Up/down arrows showing progress status
- **Last Sync Time**: Shows when data was last updated
- **Error Handling**: Clear error messages for issues

## API Endpoints

### Authentication
- `GET /auth/google` - Get Google OAuth URL
- `GET /auth/google/callback` - Handle OAuth callback
- `POST /api/auth/refresh` - Refresh access token

### Health Data
- `GET /api/health/summary` - Get health metrics summary

### Health Check
- `GET /health` - Server health status

## Security Features

### Backend Security
- **Helmet.js**: Security headers
- **Rate Limiting**: API request throttling
- **CORS**: Cross-origin resource sharing protection
- **JWT Tokens**: Secure session management
- **Environment Variables**: Secure credential storage

### Frontend Security
- **Token Storage**: Secure localStorage usage
- **Error Handling**: Graceful error management
- **Input Validation**: Client-side validation
- **HTTPS**: Production HTTPS enforcement

## Data Privacy

### Data Handling
- **No Data Storage**: Health data is not stored on the server
- **Real-time Fetching**: Data is fetched on-demand
- **Token Management**: Secure OAuth token handling
- **User Control**: Users can disconnect at any time

### Permissions
The application requests the following Google Fit permissions:
- `fitness.activity.read` - Read activity data
- `fitness.body.read` - Read body metrics
- `fitness.heart_rate.read` - Read heart rate data
- `fitness.sleep.read` - Read sleep data
- `userinfo.profile` - Basic profile information
- `userinfo.email` - Email address

## Troubleshooting

### Common Issues

#### Authentication Errors
- **Invalid Client ID**: Check your Google Cloud Console credentials
- **Redirect URI Mismatch**: Ensure redirect URIs match exactly
- **API Not Enabled**: Verify Google Fit API is enabled

#### Data Not Loading
- **Permissions Denied**: User may have denied required permissions
- **No Data Available**: Google Fit may not have data for the requested period
- **API Quota Exceeded**: Check Google Cloud Console quotas

#### Network Errors
- **CORS Issues**: Verify frontend URL in backend CORS configuration
- **Server Not Running**: Ensure backend server is started
- **Port Conflicts**: Check if ports 3001 and 5173 are available

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in the backend `.env` file.

## Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use a production database for token storage
3. Configure HTTPS
4. Set up proper logging and monitoring

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to your hosting provider
3. Update environment variables for production
4. Configure custom domain

### Environment Variables (Production)
```env
NODE_ENV=production
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your_secure_production_jwt_secret
```

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Google Fit API documentation
3. Check browser console for errors
4. Verify network connectivity

## License

This integration is part of the MindBody Hub application and follows the same licensing terms.


