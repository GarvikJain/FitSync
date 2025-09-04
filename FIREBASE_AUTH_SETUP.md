# Firebase Authentication Setup Guide

## Overview
This guide explains how to set up Firebase Google Authentication for the MindBody Hub application.

## Features
- **Google Sign-In**: One-click authentication with Google accounts
- **User Profile**: Display user name and avatar in the navbar
- **Protected Routes**: Secure access to certain features
- **Persistent Sessions**: Automatic login state management
- **Sign Out**: Easy account disconnection

## Setup Instructions

### 1. Firebase Console Configuration

#### Enable Google Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mediagriassist`
3. Navigate to Authentication → Sign-in method
4. Enable Google as a sign-in provider
5. Configure OAuth consent screen if needed

#### Web App Configuration
The Firebase configuration is already set up in `src/lib/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyBL_iykJiiwgfYQU-uBpb_Yf4wB6sl63kI",
  authDomain: "mediagriassist.firebaseapp.com",
  projectId: "mediagriassist",
  storageBucket: "mediagriassist.firebasestorage.app",
  messagingSenderId: "180830730557",
  appId: "1:180830730557:web:e966a55537975a8ca36d54"
};
```

### 2. Running the Application

#### Install Dependencies
```bash
npm install
```

#### Start the Application
```bash
npm run dev
```

#### Access the Application
- Open `http://localhost:5173`
- Click "Sign In" in the top-right corner
- Complete Google authentication

## Usage

### Authentication Flow
1. **Sign In**: Click the "Sign In" button in the navbar
2. **Google Popup**: Complete Google authentication in the popup
3. **User Profile**: See your name and avatar in the navbar
4. **Sign Out**: Click your avatar → "Sign out"

### Features Available
- **Personalized Welcome**: Shows your name when signed in
- **User Avatar**: Displays your Google profile picture
- **Dropdown Menu**: Access user info and sign out
- **Loading States**: Smooth transitions during authentication

## Components

### AuthButtons
- Located in the navbar
- Shows "Sign In" button when not authenticated
- Shows user avatar with dropdown when authenticated

### AuthProvider
- Wraps the entire application
- Provides authentication state to all components
- Handles Firebase auth state changes

### ProtectedRoute
- Wrapper component for protected features
- Shows authentication prompt for unauthenticated users
- Can be used to protect specific routes or components

## Security Features

### Firebase Security
- **OAuth 2.0**: Secure Google authentication
- **Token Management**: Automatic token refresh
- **Session Persistence**: Maintains login state across browser sessions

### Application Security
- **Context Isolation**: Authentication state isolated in context
- **Error Handling**: Graceful error management
- **Loading States**: Prevents UI flashing during auth checks

## Customization

### Styling
- Authentication buttons use the wellness theme colors
- Avatar and dropdown match the overall design
- Responsive design for mobile and desktop

### Adding Protected Features
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

<ProtectedRoute>
  <YourProtectedComponent />
</ProtectedRoute>
```

### Custom Fallback
```typescript
<ProtectedRoute 
  fallback={<YourCustomAuthPrompt />}
>
  <YourProtectedComponent />
</ProtectedRoute>
```

## Troubleshooting

### Common Issues

#### Authentication Popup Blocked
- Ensure popup blockers are disabled
- Check browser settings for the domain

#### Sign In Not Working
- Verify Firebase configuration
- Check browser console for errors
- Ensure Google authentication is enabled in Firebase Console

#### User Not Persisting
- Check Firebase authentication state
- Verify localStorage is not being cleared
- Check for conflicting authentication systems

### Debug Mode
Enable debug logging by checking browser console for authentication events.

## Production Deployment

### Environment Variables
For production, consider using environment variables for Firebase config:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Security Rules
- Configure Firebase security rules for your database
- Set up proper CORS policies
- Enable HTTPS in production

## Support

For issues and questions:
1. Check Firebase Console for authentication status
2. Review browser console for errors
3. Verify Firebase configuration
4. Check network connectivity

## License

This authentication system is part of the MindBody Hub application and follows the same licensing terms.
