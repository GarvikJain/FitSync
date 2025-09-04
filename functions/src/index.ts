import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Import Cloud Functions
import { aggregateDailyStats, updateTeamTotals } from './aggregateDailyStats';
import { postTeamMessage, getTeamMessages } from './chat';
import { createChallengeOnInactivity, createChallengeOnInactivityManual } from './createChallengeOnInactivity';

// Export all Cloud Functions
export {
  // Daily aggregation
  aggregateDailyStats,
  updateTeamTotals,

  // Team chat
  postTeamMessage,
  getTeamMessages,

  // AI challenge generation
  createChallengeOnInactivity,
  createChallengeOnInactivityManual,
};

// Health check function
export const healthCheck = functions.https.onRequest((req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'fitsync-functions',
    version: '1.0.0'
  });
});
