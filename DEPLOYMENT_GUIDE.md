# FitSync Backend Deployment Guide

## 🚀 Complete Deployment Instructions

This guide covers deploying the FitSync real-time leaderboard system with AI challenge generation and secure Firestore rules.

## 📋 Prerequisites

1. **Firebase CLI** installed and authenticated
2. **Node.js** v18+ installed
3. **Firebase Project** "fitsync" created
4. **OpenAI API Key** for AI challenge generation

## 🔧 Setup Commands

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install functions dependencies
cd functions
npm install
cd ..
```

### 2. Firebase Configuration

```bash
# Login to Firebase
firebase login

# Set project
firebase use fitsync

# Initialize Firebase (if not already done)
firebase init
```

### 3. Environment Setup

Create `.env.local` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=fitsync.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fitsync
VITE_FIREBASE_STORAGE_BUCKET=fitsync.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# Firebase Functions Configuration
VITE_FIREBASE_FUNCTIONS_REGION=us-central1

# Development Configuration
VITE_USE_EMULATOR=false
VITE_FIRESTORE_EMULATOR_HOST=localhost
VITE_FIRESTORE_EMULATOR_PORT=8080
VITE_FUNCTIONS_EMULATOR_HOST=localhost
VITE_FUNCTIONS_EMULATOR_PORT=5001
VITE_AUTH_EMULATOR_HOST=localhost
VITE_AUTH_EMULATOR_PORT=9099
```

### 4. Set OpenAI API Key

```bash
# Set OpenAI API key for AI challenge generation
firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY_HERE"

# Verify the configuration
firebase functions:config:get
```

## 🧪 Local Testing with Emulators

### 1. Start Emulators

```bash
# Start all emulators
firebase emulators:start

# Or start specific emulators
firebase emulators:start --only firestore,functions,auth
```

### 2. Test Functions

```bash
# Test health check
curl http://localhost:5001/fitsync/us-central1/healthCheck

# Test in another terminal
npm run dev
```

### 3. Emulator UI

Access the Firebase Emulator UI at: http://localhost:4000

## 🚀 Production Deployment

### 1. Deploy Firestore Rules and Indexes

```bash
# Deploy security rules and indexes
firebase deploy --only firestore

# Verify deployment
firebase firestore:rules:get
firebase firestore:indexes:get
```

### 2. Deploy Cloud Functions

```bash
# Build and deploy functions
cd functions
npm run build
cd ..
firebase deploy --only functions

# Verify deployment
firebase functions:list
```

### 3. Deploy Everything

```bash
# Deploy all components
firebase deploy

# Check deployment status
firebase projects:list
```

## 🔍 Testing Deployed Functions

### 1. Test Health Check

```bash
curl https://us-central1-fitsync.cloudfunctions.net/healthCheck
```

### 2. Test Team Chat (requires authentication)

```javascript
// In your React app
import { functionsService } from '@/lib/functionsHelpers';

// Post a team message
const result = await functionsService.postTeamMessage({
  teamId: 'your-team-id',
  message: 'Hello team!',
  messageType: 'text'
});
```

### 3. Test AI Challenge Generation

```bash
# Manual trigger (requires admin authentication)
curl -X POST https://us-central1-fitsync.cloudfunctions.net/createChallengeOnInactivityManual \
  -H "Authorization: Bearer YOUR_ID_TOKEN"
```

## 📊 Monitoring and Logs

### 1. View Function Logs

```bash
# View all function logs
firebase functions:log

# View specific function logs
firebase functions:log --only aggregateDailyStats
firebase functions:log --only createChallengeOnInactivity
```

### 2. Monitor Performance

- **Firebase Console**: https://console.firebase.google.com/project/fitsync
- **Functions**: Monitor execution time and errors
- **Firestore**: Monitor read/write operations
- **Authentication**: Monitor user activity

## 🔒 Security Verification

### 1. Test Security Rules

```bash
# Test with authenticated user
firebase firestore:rules:test

# Test specific rules
firebase firestore:rules:test --test-file=test-rules.json
```

### 2. Verify Access Control

- Users can only read/write their own data
- Leaderboards are read-only for users
- Only Cloud Functions can write to aggregates
- Team messages require team membership

## 🐛 Troubleshooting

### Common Issues

#### 1. Function Deployment Fails

```bash
# Check function logs
firebase functions:log

# Rebuild functions
cd functions
npm run build
cd ..
firebase deploy --only functions
```

#### 2. Index Errors

```bash
# Deploy indexes
firebase deploy --only firestore:indexes

# Check index status
firebase firestore:indexes:get
```

#### 3. Authentication Issues

- Verify Firebase project configuration
- Check API keys in `.env.local`
- Ensure Auth is enabled in Firebase Console

#### 4. AI Challenge Generation Not Working

```bash
# Check OpenAI API key
firebase functions:config:get

# Test with manual trigger
firebase functions:shell
# Then call: createChallengeOnInactivityManual()
```

### Debug Mode

Enable debug logging in your app:

```typescript
// In src/lib/firebase.ts
if (import.meta.env.DEV) {
  // Enable debug logging
  console.log('Firebase debug mode enabled');
}
```

## 📈 Performance Optimization

### 1. Firestore Optimization

- All queries use proper indexes
- Batch writes for efficiency
- Pagination for large datasets
- Real-time listeners with limits

### 2. Cloud Functions Optimization

- Appropriate memory allocation
- Reasonable timeout settings
- Error handling and retry logic
- Efficient data processing

## 🔄 Maintenance

### Regular Tasks

1. **Monitor Logs**: Check function logs weekly
2. **Update Dependencies**: Monthly updates
3. **Security Review**: Quarterly audit
4. **Performance Review**: Monthly check

### Backup Strategy

1. **Firestore**: Automatic backups enabled
2. **Functions**: Version control with Git
3. **Configuration**: Document all settings

## 📞 Support

### Getting Help

1. **Firebase Console**: Check service status
2. **Function Logs**: Start with error logs
3. **Documentation**: Firebase docs
4. **Community**: Firebase community forums

### Emergency Procedures

1. **Function Failure**: Check logs and redeploy
2. **Database Issues**: Check Firestore status
3. **Authentication Issues**: Verify configuration
4. **AI Service Issues**: Check OpenAI API status

## ✅ Verification Checklist

- [ ] Firebase project configured
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] OpenAI API key configured
- [ ] Firestore rules deployed
- [ ] Indexes deployed
- [ ] Cloud Functions deployed
- [ ] Emulators tested locally
- [ ] Production deployment verified
- [ ] Security rules tested
- [ ] Function logs monitored
- [ ] Performance metrics checked

## 🎉 Success!

Your FitSync backend is now fully deployed with:

- ✅ Real-time leaderboards
- ✅ Daily aggregation (Asia/Kolkata timezone)
- ✅ AI challenge generation
- ✅ Secure Firestore rules
- ✅ Team chat functionality
- ✅ Production-ready monitoring

**Next Steps:**
1. Test the live leaderboard in your React app
2. Monitor function execution logs
3. Set up alerts for errors
4. Scale as needed for your user base

---

**Status**: ✅ Production Ready  
**Last Updated**: January 2025  
**Version**: 1.0.0
