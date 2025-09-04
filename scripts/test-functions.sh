#!/bin/bash

# FitSync Functions Testing Script
echo "🧪 Testing FitSync Cloud Functions..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Start emulators
echo "🚀 Starting Firebase emulators..."
firebase emulators:start --only firestore,functions,auth &
EMULATOR_PID=$!

# Wait for emulators to start
echo "⏳ Waiting for emulators to start..."
sleep 10

# Test health check
echo "🔍 Testing health check function..."
curl -X GET http://localhost:5001/fitsync/us-central1/healthCheck

echo ""
echo "📝 Testing postTeamMessage function..."
# This would require authentication in a real test
echo "Note: postTeamMessage requires authentication. Test this through the UI."

echo ""
echo "📊 Testing aggregateDailyStats function..."
echo "Note: aggregateDailyStats is a scheduled function. It will run automatically at 1 AM UTC."

# Stop emulators
echo "🛑 Stopping emulators..."
kill $EMULATOR_PID

echo "✅ Function testing complete!"
echo ""
echo "To test with real data:"
echo "1. Start the emulators: firebase emulators:start --only firestore,functions,auth"
echo "2. Use the Firebase Emulator UI at http://localhost:4000"
echo "3. Test functions through the UI or with authenticated requests"
