import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

interface Activity {
  uid: string;
  type: 'steps' | 'calories' | 'workout' | 'challenge' | 'wellness';
  value: number;
  timestamp: admin.firestore.Timestamp;
  teamId?: string;
}

interface UserProfile {
  uid: string;
  displayName: string;
  totalSteps: number;
  totalCalories: number;
  totalWorkouts: number;
  wellnessScore: number;
  department?: string;
  teamId?: string;
}

interface Team {
  id: string;
  name: string;
  members: string[];
  department?: string;
}

interface DailyAggregate {
  uid: string;
  displayName: string;
  date: string;
  totalSteps: number;
  totalCalories: number;
  totalWorkouts: number;
  wellnessScore: number;
  department?: string;
  teamId?: string;
  activitiesCount: number;
  lastActivity: admin.firestore.Timestamp;
  createdAt: admin.firestore.Timestamp;
}

interface LeaderboardEntry {
  uid: string;
  displayName: string;
  totalPoints: number;
  rank: number;
  activities: {
    steps: number;
    calories: number;
    workouts: number;
  };
  department?: string;
  teamId?: string;
  lastUpdated: admin.firestore.Timestamp;
}

interface TeamEntry {
  teamId: string;
  teamName: string;
  totalPoints: number;
  rank: number;
  memberCount: number;
  averagePoints: number;
  department?: string;
  lastUpdated: admin.firestore.Timestamp;
}

// Main daily aggregation function - runs at 1 AM Asia/Kolkata timezone
export const aggregateDailyStats = functions.pubsub
  .schedule('0 1 * * *') // Run daily at 1 AM UTC (6:30 AM IST)
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateString = yesterday.toISOString().split('T')[0];
    
    console.log(`Starting daily aggregation for date: ${dateString} (Asia/Kolkata timezone)`);
    
    try {
      // Get all activities from yesterday
      const startOfDay = new Date(yesterday);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(yesterday);
      endOfDay.setHours(23, 59, 59, 999);

      const activitiesSnapshot = await db
        .collection('activities')
        .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(startOfDay))
        .where('timestamp', '<=', admin.firestore.Timestamp.fromDate(endOfDay))
        .get();

      console.log(`Found ${activitiesSnapshot.size} activities for ${dateString}`);

      // Group activities by user
      const userActivities = new Map<string, Activity[]>();
      activitiesSnapshot.forEach(doc => {
        const activity = doc.data() as Activity;
        if (!userActivities.has(activity.uid)) {
          userActivities.set(activity.uid, []);
        }
        userActivities.get(activity.uid)!.push(activity);
      });

      // Get user profiles for all users with activities
      const userIds = Array.from(userActivities.keys());
      const userProfiles = new Map<string, UserProfile>();
      
      if (userIds.length > 0) {
        // Process in batches of 10 (Firestore 'in' query limit)
        const batchSize = 10;
        for (let i = 0; i < userIds.length; i += batchSize) {
          const batch = userIds.slice(i, i + batchSize);
          const usersSnapshot = await db
            .collection('users')
            .where(admin.firestore.FieldPath.documentId(), 'in', batch)
            .get();

          usersSnapshot.forEach(doc => {
            const userData = doc.data() as UserProfile;
            userData.uid = doc.id;
            userProfiles.set(doc.id, userData);
          });
        }
      }

      // Get teams data
      const teamsSnapshot = await db.collection('teams').get();
      const teams = new Map<string, Team>();
      teamsSnapshot.forEach(doc => {
        const teamData = doc.data() as Team;
        teamData.id = doc.id;
        teams.set(doc.id, teamData);
      });

      // Create daily aggregates
      const dailyAggregates: DailyAggregate[] = [];
      const leaderboardEntries: LeaderboardEntry[] = [];
      const teamTotals = new Map<string, { totalPoints: number; memberCount: number; members: string[] }>();

      for (const [uid, activities] of userActivities) {
        const userProfile = userProfiles.get(uid);
        if (!userProfile) continue;

        // Calculate daily totals
        let dailySteps = 0;
        let dailyCalories = 0;
        let dailyWorkouts = 0;
        let lastActivityTime = activities[0].timestamp;

        activities.forEach(activity => {
          switch (activity.type) {
            case 'steps':
              dailySteps += activity.value;
              break;
            case 'calories':
              dailyCalories += activity.value;
              break;
            case 'workout':
              dailyWorkouts += 1;
              break;
          }
          
          if (activity.timestamp > lastActivityTime) {
            lastActivityTime = activity.timestamp;
          }
        });

        // Calculate wellness score (enhanced formula)
        const wellnessScore = Math.min(100, 
          (dailySteps / 10000) * 30 + 
          (dailyCalories / 2000) * 20 + 
          (dailyWorkouts * 15) + 
          (userProfile.wellnessScore * 0.35)
        );

        const dailyAggregate: DailyAggregate = {
          uid,
          displayName: userProfile.displayName,
          date: dateString,
          totalSteps: dailySteps,
          totalCalories: dailyCalories,
          totalWorkouts: dailyWorkouts,
          wellnessScore: Math.round(wellnessScore),
          department: userProfile.department,
          teamId: userProfile.teamId,
          activitiesCount: activities.length,
          lastActivity: lastActivityTime,
          createdAt: admin.firestore.Timestamp.now()
        };

        dailyAggregates.push(dailyAggregate);

        // Create leaderboard entry
        const leaderboardEntry: LeaderboardEntry = {
          uid,
          displayName: userProfile.displayName,
          totalPoints: Math.round(wellnessScore),
          rank: 0, // Will be set after sorting
          activities: {
            steps: dailySteps,
            calories: dailyCalories,
            workouts: dailyWorkouts
          },
          department: userProfile.department,
          teamId: userProfile.teamId,
          lastUpdated: admin.firestore.Timestamp.now()
        };

        leaderboardEntries.push(leaderboardEntry);

        // Track team totals
        if (userProfile.teamId) {
          if (!teamTotals.has(userProfile.teamId)) {
            teamTotals.set(userProfile.teamId, { totalPoints: 0, memberCount: 0, members: [] });
          }
          const teamTotal = teamTotals.get(userProfile.teamId)!;
          teamTotal.totalPoints += Math.round(wellnessScore);
          teamTotal.memberCount += 1;
          teamTotal.members.push(uid);
        }
      }

      // Sort leaderboard entries by total points
      leaderboardEntries.sort((a, b) => b.totalPoints - a.totalPoints);
      leaderboardEntries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      // Create team leaderboard entries
      const teamEntries: TeamEntry[] = [];
      for (const [teamId, teamTotal] of teamTotals) {
        const team = teams.get(teamId);
        if (team) {
          teamEntries.push({
            teamId,
            teamName: team.name,
            totalPoints: teamTotal.totalPoints,
            rank: 0, // Will be set after sorting
            memberCount: teamTotal.memberCount,
            averagePoints: Math.round(teamTotal.totalPoints / teamTotal.memberCount),
            department: team.department,
            lastUpdated: admin.firestore.Timestamp.now()
          });
        }
      }

      // Sort team entries by total points
      teamEntries.sort((a, b) => b.totalPoints - a.totalPoints);
      teamEntries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      // Batch write daily aggregates (500 max per batch)
      const batchSize = 500;
      for (let i = 0; i < dailyAggregates.length; i += batchSize) {
        const batch = db.batch();
        const batchData = dailyAggregates.slice(i, i + batchSize);
        
        batchData.forEach(aggregate => {
          const docRef = db.collection('dailyAggregates').doc(`${aggregate.uid}_${dateString}`);
          batch.set(docRef, aggregate);
        });
        
        await batch.commit();
      }

      // Write leaderboards
      const leaderboardBatch = db.batch();
      
      // Individual leaderboard
      const leaderboardRef = db.collection('leaderboards').doc(dateString);
      leaderboardBatch.set(leaderboardRef, {
        date: dateString,
        entries: leaderboardEntries,
        totalParticipants: leaderboardEntries.length,
        createdAt: admin.firestore.Timestamp.now(),
        lastUpdated: admin.firestore.Timestamp.now()
      });

      // Team leaderboard
      const teamLeaderboardRef = db.collection('teamLeaderboards').doc(dateString);
      leaderboardBatch.set(teamLeaderboardRef, {
        date: dateString,
        entries: teamEntries,
        totalTeams: teamEntries.length,
        createdAt: admin.firestore.Timestamp.now(),
        lastUpdated: admin.firestore.Timestamp.now()
      });

      await leaderboardBatch.commit();

      console.log(`Successfully aggregated data for ${dailyAggregates.length} users`);
      console.log(`Created leaderboard with ${leaderboardEntries.length} entries`);
      console.log(`Created team leaderboard with ${teamEntries.length} teams`);

      // Update user profiles with latest wellness scores (batched)
      const updateBatchSize = 500;
      for (let i = 0; i < dailyAggregates.length; i += updateBatchSize) {
        const updateBatch = db.batch();
        const batchData = dailyAggregates.slice(i, i + updateBatchSize);
        
        batchData.forEach(aggregate => {
          const userRef = db.collection('users').doc(aggregate.uid);
          updateBatch.update(userRef, {
            wellnessScore: aggregate.wellnessScore,
            lastActive: admin.firestore.Timestamp.now(),
            lastAggregatedDate: dateString
          });
        });
        
        await updateBatch.commit();
      }

      console.log('Daily aggregation completed successfully');
      return { 
        success: true, 
        processedUsers: dailyAggregates.length,
        processedTeams: teamEntries.length,
        date: dateString
      };

    } catch (error) {
      console.error('Error in daily aggregation:', error);
      throw new functions.https.HttpsError('internal', 'Daily aggregation failed', error);
    }
  });

// Helper function to update team totals
export const updateTeamTotals = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { teamId, date } = data;
  
  if (!teamId || !date) {
    throw new functions.https.HttpsError('invalid-argument', 'Team ID and date are required');
  }

  try {
    // Get all daily aggregates for the team on the specified date
    const aggregatesSnapshot = await db
      .collection('dailyAggregates')
      .where('teamId', '==', teamId)
      .where('date', '==', date)
      .get();

    if (aggregatesSnapshot.empty) {
      return { success: true, message: 'No data found for team on this date' };
    }

    // Calculate team totals
    let totalPoints = 0;
    let memberCount = 0;
    const members: string[] = [];

    aggregatesSnapshot.forEach(doc => {
      const aggregate = doc.data() as DailyAggregate;
      totalPoints += aggregate.wellnessScore;
      memberCount += 1;
      members.push(aggregate.uid);
    });

    const averagePoints = Math.round(totalPoints / memberCount);

    // Get team info
    const teamDoc = await db.collection('teams').doc(teamId).get();
    if (!teamDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Team not found');
    }

    const teamData = teamDoc.data() as Team;

    // Update team leaderboard
    const teamLeaderboardRef = db.collection('teamLeaderboards').doc(date);
    const teamLeaderboardDoc = await teamLeaderboardRef.get();
    
    if (teamLeaderboardDoc.exists) {
      const leaderboardData = teamLeaderboardDoc.data();
      const entries = leaderboardData?.entries || [];
      
      // Find and update the team entry
      const teamIndex = entries.findIndex((entry: TeamEntry) => entry.teamId === teamId);
      
      if (teamIndex !== -1) {
        entries[teamIndex] = {
          teamId,
          teamName: teamData.name,
          totalPoints,
          rank: 0, // Will be recalculated
          memberCount,
          averagePoints,
          department: teamData.department,
          lastUpdated: admin.firestore.Timestamp.now()
        };
        
        // Re-sort entries by total points
        entries.sort((a: TeamEntry, b: TeamEntry) => b.totalPoints - a.totalPoints);
        entries.forEach((entry: TeamEntry, index: number) => {
          entry.rank = index + 1;
        });
        
        await teamLeaderboardRef.update({
          entries,
          lastUpdated: admin.firestore.Timestamp.now()
        });
      }
    }

    console.log(`Updated team totals for team ${teamId} on ${date}`);
    return { 
      success: true, 
      teamId, 
      date, 
      totalPoints, 
      memberCount, 
      averagePoints 
    };

  } catch (error) {
    console.error('Error updating team totals:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update team totals', error);
  }
});
