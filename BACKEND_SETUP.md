# FitSync Backend Setup Guide

## 🚀 Overview

This guide covers the complete backend setup for FitSync, including Firebase Cloud Functions, Firestore configuration, and real-time data syncing.

## 📁 Project Structure

```
fitsync/
├── functions/                    # Cloud Functions
│   ├── src/
│   │   ├── index.ts             # Main functions export
│   │   ├── aggregateDailyStats.ts # Daily aggregation function
│   │   └── chat.ts              # Team chat functions
│   ├── package.json
│   └── tsconfig.json
├── src/lib/
│   ├── firebase.ts              # Firebase configuration
│   ├── firestore.ts             # Firestore service layer
│   └── functionsHelpers.ts      # Cloud Functions helpers
├── firestore.rules              # Security rules
├── firestore.indexes.json       # Database indexes
├── firebase.json                # Firebase configuration
└── scripts/                     # Deployment scripts
    ├── setup.sh
    ├── deploy.sh
    └── test-functions.sh
```

## 🔧 Prerequisites

1. **Node.js** (v18 or higher)
2. **Firebase CLI** (`npm install -g firebase-tools`)
3. **Firebase Project** with ID "fitsync"
4. **Authentication** enabled in Firebase Console

## 🛠️ Setup Instructions

### 1. Initial Setup

```bash
# Run the setup script
npm run setup

# Or manually:
# 1. Install dependencies
npm install
cd functions && npm install && cd ..

# 2. Login to Firebase
firebase login

# 3. Set project
firebase use fitsync
```

### 2. Environment Configuration

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
VITE_USE_EMULATOR=true
VITE_FIRESTORE_EMULATOR_HOST=localhost
VITE_FIRESTORE_EMULATOR_PORT=8080
VITE_FUNCTIONS_EMULATOR_HOST=localhost
VITE_FUNCTIONS_EMULATOR_PORT=5001
VITE_AUTH_EMULATOR_HOST=localhost
VITE_AUTH_EMULATOR_PORT=9099
```

### 3. Local Development

```bash
# Start Firebase emulators
npm run emulators

# In another terminal, start the React app
npm run dev
```

The emulators will be available at:
- **Firestore Emulator**: http://localhost:8080
- **Functions Emulator**: http://localhost:5001
- **Auth Emulator**: http://localhost:9099
- **Emulator UI**: http://localhost:4000

## ☁️ Cloud Functions

### Available Functions

#### 1. `aggregateDailyStats` (Scheduled)
- **Trigger**: Daily at 1 AM UTC
- **Purpose**: Aggregates user activities and creates leaderboards
- **Collections Updated**:
  - `dailyAggregates/{userId}_{date}`
  - `leaderboards/{date}`

#### 2. `postTeamMessage` (Callable)
- **Purpose**: Post messages to team chats
- **Authentication**: Required
- **Validation**: Team membership verification

#### 3. `getTeamMessages` (Callable)
- **Purpose**: Retrieve team messages with pagination
- **Authentication**: Required
- **Validation**: Team membership verification

#### 4. `healthCheck` (HTTP)
- **Purpose**: Health monitoring
- **Endpoint**: `/api/healthCheck`

### Function Usage

```typescript
import { functionsService } from '@/lib/functionsHelpers';

// Post a team message
const result = await functionsService.postTeamMessage({
  teamId: 'team123',
  message: 'Hello team!',
  messageType: 'text'
});

// Get team messages
const messages = await functionsService.getTeamMessages({
  teamId: 'team123',
  limit: 50
});
```

## 🗄️ Firestore Configuration

### Collections Structure

```
fitsync/
├── users/                       # User profiles
├── activities/                  # User activities
├── challenges/                  # Wellness challenges
├── teams/                      # Team data
│   └── {teamId}/
│       └── messages/           # Team chat messages
├── wellnessMetrics/            # Daily wellness data
├── notifications/              # User notifications
├── dailyAggregates/            # Daily statistics (read-only)
├── leaderboards/               # Leaderboard data (read-only)
├── rewards/                    # Available rewards
└── userRewards/               # User reward redemptions
```

### Security Rules

- **Users**: Can read all profiles, modify only their own
- **Activities**: Users can only access their own activities
- **Teams**: Team members can read, admins can modify
- **Messages**: Only team members can access
- **Aggregates/Leaderboards**: Read-only for all users
- **Rewards**: Read-only for all users

### Indexes

All required composite indexes are defined in `firestore.indexes.json`:
- User queries by wellness score
- Activity queries by user and timestamp
- Challenge queries by status and type
- Message queries by team and timestamp
- And many more...

## 🔄 Real-time Listeners

### Available Listeners

```typescript
import { realtimeListeners } from '@/lib/functionsHelpers';

// Team messages
const unsubscribe = realtimeListeners.subscribeToTeamMessages(
  'team123',
  (messages) => console.log(messages)
);

// User activities
const unsubscribe = realtimeListeners.subscribeToUserActivities(
  'user123',
  (activities) => console.log(activities)
);

// Rewards
const unsubscribe = realtimeListeners.subscribeToRewards(
  (rewards) => console.log(rewards)
);

// Leaderboards
const unsubscribe = realtimeListeners.subscribeToLeaderboards(
  '2024-01-15',
  (leaderboard) => console.log(leaderboard)
);
```

## 🚀 Deployment

### Deploy Everything

```bash
npm run deploy
```

### Deploy Specific Components

```bash
# Deploy only functions
npm run deploy:functions

# Deploy only Firestore rules
npm run deploy:firestore
```

### Manual Deployment

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Cloud Functions
firebase deploy --only functions

# Deploy everything
firebase deploy
```

## 🧪 Testing

### Test Functions Locally

```bash
npm run test:functions
```

### Test with Emulators

1. Start emulators: `npm run emulators`
2. Open Emulator UI: http://localhost:4000
3. Test functions through the UI
4. Use the React app to test real-time features

### Test Authentication

1. Create test users in Auth Emulator
2. Test protected functions
3. Verify security rules

## 📊 Monitoring

### Cloud Functions Logs

```bash
# View function logs
firebase functions:log

# View specific function logs
firebase functions:log --only aggregateDailyStats
```

### Firestore Usage

Monitor Firestore usage in the Firebase Console:
- Read/write operations
- Storage usage
- Index usage

## 🔒 Security Considerations

### Production Security

1. **Environment Variables**: Never commit `.env.local`
2. **API Keys**: Rotate keys regularly
3. **Security Rules**: Test thoroughly before deployment
4. **Function Permissions**: Use least privilege principle

### Data Validation

- All inputs are validated in Cloud Functions
- Firestore security rules provide additional protection
- Type safety with TypeScript interfaces

## 🐛 Troubleshooting

### Common Issues

#### 1. Index Errors
```bash
# Deploy indexes
firebase deploy --only firestore:indexes
```

#### 2. Function Deployment Fails
```bash
# Check function logs
firebase functions:log

# Rebuild functions
cd functions && npm run build
```

#### 3. Emulator Issues
```bash
# Clear emulator data
firebase emulators:exec --only firestore,functions,auth "echo 'Cleared'"

# Restart emulators
npm run emulators
```

#### 4. Authentication Issues
- Verify Firebase project configuration
- Check API keys in `.env.local`
- Ensure Auth is enabled in Firebase Console

### Debug Mode

Enable debug logging:

```typescript
// In your app
import { connectFirestoreEmulator } from 'firebase/firestore';

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## 📈 Performance Optimization

### Firestore Optimization

1. **Use Indexes**: All queries use proper indexes
2. **Batch Operations**: Multiple writes in single batch
3. **Pagination**: Limit query results
4. **Real-time Listeners**: Efficient snapshot listeners

### Cloud Functions Optimization

1. **Cold Start**: Functions are optimized for quick startup
2. **Memory**: Appropriate memory allocation
3. **Timeout**: Reasonable timeout settings
4. **Retry Logic**: Built-in error handling

## 🔄 Maintenance

### Regular Tasks

1. **Monitor Logs**: Check function logs weekly
2. **Update Dependencies**: Monthly dependency updates
3. **Security Review**: Quarterly security audit
4. **Performance Review**: Monthly performance check

### Backup Strategy

1. **Firestore**: Automatic backups enabled
2. **Functions**: Version control with Git
3. **Configuration**: Document all settings

## 📞 Support

For technical support:

1. **Check Logs**: Start with function logs
2. **Firebase Console**: Check service status
3. **Documentation**: Refer to Firebase docs
4. **Community**: Firebase community forums

---

**Status**: ✅ Production Ready
**Last Updated**: January 2025
**Version**: 1.0.0
