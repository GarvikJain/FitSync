#!/bin/bash

# FitSync Backend Deployment Script
echo "🚀 Deploying FitSync Backend..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Set the project
echo "📁 Setting Firebase project to 'fitsync'..."
firebase use fitsync

# Deploy Firestore rules and indexes
echo "📋 Deploying Firestore rules and indexes..."
firebase deploy --only firestore

# Build and deploy Cloud Functions
echo "⚡ Building and deploying Cloud Functions..."
cd functions
npm run build
cd ..
firebase deploy --only functions

echo "✅ Deployment complete!"
echo ""
echo "Deployed components:"
echo "- Firestore security rules"
echo "- Firestore indexes"
echo "- Cloud Functions (aggregateDailyStats, postTeamMessage, getTeamMessages, healthCheck)"
echo ""
echo "You can now test the functions in the Firebase Console or use the emulators for local testing."
