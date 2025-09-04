#!/bin/bash

# FitSync Backend Setup Script
echo "🚀 Setting up FitSync Backend..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase:"
    firebase login
fi

# Set the project
echo "📁 Setting Firebase project to 'fitsync'..."
firebase use fitsync

# Install dependencies
echo "📦 Installing dependencies..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Install functions dependencies
echo "Installing functions dependencies..."
cd functions
npm install
cd ..

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBL_iykJiiwgfYQU-uBpb_Yf4wB6sl63kI
VITE_FIREBASE_AUTH_DOMAIN=fitsync.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fitsync
VITE_FIREBASE_STORAGE_BUCKET=fitsync.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=180830730557
VITE_FIREBASE_APP_ID=1:180830730557:web:e966a55537975a8ca36d54

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

# App Configuration
VITE_APP_NAME=FitSync
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
EOF
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the emulators: npm run emulators"
echo "2. Deploy to production: npm run deploy"
echo "3. Test the functions: npm run test:functions"
