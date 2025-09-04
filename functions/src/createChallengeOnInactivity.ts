import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  department?: string;
  teamId?: string;
  lastActive: admin.firestore.Timestamp;
  wellnessScore: number;
  preferences?: {
    challengeTypes: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
}

interface Team {
  id: string;
  name: string;
  members: string[];
  department?: string;
}

interface Challenge {
  id: string;
  createdBy: 'system';
  targetUid: string | null;
  teamId: string | null;
  name: string;
  description: string;
  type: 'steps' | 'calories' | 'workout' | 'streak' | 'wellness' | 'team';
  category: 'fitness' | 'wellness' | 'social' | 'mindfulness' | 'nutrition';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  target: number;
  duration: number; // in days
  startDate: admin.firestore.Timestamp;
  endDate: admin.firestore.Timestamp;
  rewards: {
    coins: number;
    points: number;
    badge?: string;
  };
  isActive: boolean;
  participants: string[];
  createdAt: admin.firestore.Timestamp;
  aiGenerated: boolean;
  aiPrompt?: string;
}

interface InactiveUser {
  uid: string;
  displayName: string;
  department?: string;
  teamId?: string;
  daysInactive: number;
  lastActivity: admin.firestore.Timestamp;
  wellnessScore: number;
}

interface InactiveTeam {
  teamId: string;
  teamName: string;
  department?: string;
  daysInactive: number;
  memberCount: number;
  averageWellnessScore: number;
}

// AI Challenge Generation Function - runs every 6 hours
export const createChallengeOnInactivity = functions.pubsub
  .schedule('0 */6 * * *') // Every 6 hours
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    console.log('Starting AI challenge generation for inactive users/teams');
    
    try {
      // Get OpenAI API key from environment
      const openaiApiKey = functions.config().openai?.key;
      
      if (!openaiApiKey) {
        console.log('OpenAI API key not configured. Skipping AI challenge generation.');
        return { success: true, message: 'OpenAI API key not configured' };
      }

      // Find inactive users (no activity for 3+ days)
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      const inactiveUsers = await findInactiveUsers(threeDaysAgo);
      const inactiveTeams = await findInactiveTeams(threeDaysAgo);
      
      console.log(`Found ${inactiveUsers.length} inactive users and ${inactiveTeams.length} inactive teams`);

      const createdChallenges: string[] = [];

      // Generate challenges for inactive users
      for (const user of inactiveUsers) {
        try {
          const challenge = await generateUserChallenge(user, openaiApiKey);
          if (challenge) {
            const challengeRef = await db.collection('challenges').add(challenge);
            createdChallenges.push(challengeRef.id);
            console.log(`Created challenge for user ${user.uid}: ${challenge.name}`);
          }
        } catch (error) {
          console.error(`Error creating challenge for user ${user.uid}:`, error);
        }
      }

      // Generate challenges for inactive teams
      for (const team of inactiveTeams) {
        try {
          const challenge = await generateTeamChallenge(team, openaiApiKey);
          if (challenge) {
            const challengeRef = await db.collection('challenges').add(challenge);
            createdChallenges.push(challengeRef.id);
            console.log(`Created challenge for team ${team.teamId}: ${challenge.name}`);
          }
        } catch (error) {
          console.error(`Error creating challenge for team ${team.teamId}:`, error);
        }
      }

      console.log(`AI challenge generation completed. Created ${createdChallenges.length} challenges`);
      return { 
        success: true, 
        createdChallenges: createdChallenges.length,
        inactiveUsers: inactiveUsers.length,
        inactiveTeams: inactiveTeams.length
      };

    } catch (error) {
      console.error('Error in AI challenge generation:', error);
      throw new functions.https.HttpsError('internal', 'AI challenge generation failed', error);
    }
  });

// Find inactive users
async function findInactiveUsers(cutoffDate: Date): Promise<InactiveUser[]> {
  const usersSnapshot = await db
    .collection('users')
    .where('lastActive', '<', admin.firestore.Timestamp.fromDate(cutoffDate))
    .limit(50) // Limit to prevent timeout
    .get();

  const inactiveUsers: InactiveUser[] = [];
  
  for (const doc of usersSnapshot.docs) {
    const userData = doc.data() as UserProfile;
    const daysInactive = Math.floor(
      (Date.now() - userData.lastActive.toDate().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Only include users inactive for 3+ days
    if (daysInactive >= 3) {
      inactiveUsers.push({
        uid: doc.id,
        displayName: userData.displayName,
        department: userData.department,
        teamId: userData.teamId,
        daysInactive,
        lastActivity: userData.lastActive,
        wellnessScore: userData.wellnessScore
      });
    }
  }
  
  return inactiveUsers;
}

// Find inactive teams
async function findInactiveTeams(cutoffDate: Date): Promise<InactiveTeam[]> {
  const teamsSnapshot = await db.collection('teams').get();
  const inactiveTeams: InactiveTeam[] = [];
  
  for (const doc of teamsSnapshot.docs) {
    const teamData = doc.data() as Team;
    
    // Get team members' last activity
    const memberActivities = await Promise.all(
      teamData.members.map(async (memberId) => {
        const userDoc = await db.collection('users').doc(memberId).get();
        if (userDoc.exists) {
          const userData = userDoc.data() as UserProfile;
          return {
            lastActive: userData.lastActive,
            wellnessScore: userData.wellnessScore
          };
        }
        return null;
      })
    );
    
    // Filter out null values and check if all members are inactive
    const validActivities = memberActivities.filter(activity => activity !== null);
    if (validActivities.length === 0) continue;
    
    const allInactive = validActivities.every(activity => 
      activity!.lastActive.toDate() < cutoffDate
    );
    
    if (allInactive) {
      const daysInactive = Math.floor(
        (Date.now() - Math.min(...validActivities.map(a => a!.lastActive.toDate().getTime()))) / (1000 * 60 * 60 * 24)
      );
      
      const averageWellnessScore = validActivities.reduce((sum, activity) => 
        sum + activity!.wellnessScore, 0
      ) / validActivities.length;
      
      inactiveTeams.push({
        teamId: doc.id,
        teamName: teamData.name,
        department: teamData.department,
        daysInactive,
        memberCount: validActivities.length,
        averageWellnessScore
      });
    }
  }
  
  return inactiveTeams;
}

// Generate challenge for individual user
async function generateUserChallenge(user: InactiveUser, apiKey: string): Promise<Challenge | null> {
  const prompt = createUserChallengePrompt(user);
  
  try {
    const aiResponse = await callOpenAI(prompt, apiKey);
    const challengeData = parseAIResponse(aiResponse, 'user');
    
    if (!challengeData) return null;
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + challengeData.duration);
    
    return {
      id: '', // Will be set by Firestore
      createdBy: 'system',
      targetUid: user.uid,
      teamId: null,
      name: challengeData.name,
      description: challengeData.description,
      type: challengeData.type,
      category: challengeData.category,
      difficulty: challengeData.difficulty,
      target: challengeData.target,
      duration: challengeData.duration,
      startDate: admin.firestore.Timestamp.fromDate(startDate),
      endDate: admin.firestore.Timestamp.fromDate(endDate),
      rewards: {
        coins: challengeData.rewards.coins,
        points: challengeData.rewards.points,
        badge: challengeData.rewards.badge
      },
      isActive: true,
      participants: [user.uid],
      createdAt: admin.firestore.Timestamp.now(),
      aiGenerated: true,
      aiPrompt: prompt
    };
  } catch (error) {
    console.error('Error generating user challenge:', error);
    return null;
  }
}

// Generate challenge for team
async function generateTeamChallenge(team: InactiveTeam, apiKey: string): Promise<Challenge | null> {
  const prompt = createTeamChallengePrompt(team);
  
  try {
    const aiResponse = await callOpenAI(prompt, apiKey);
    const challengeData = parseAIResponse(aiResponse, 'team');
    
    if (!challengeData) return null;
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + challengeData.duration);
    
    return {
      id: '', // Will be set by Firestore
      createdBy: 'system',
      targetUid: null,
      teamId: team.teamId,
      name: challengeData.name,
      description: challengeData.description,
      type: 'team',
      category: challengeData.category,
      difficulty: challengeData.difficulty,
      target: challengeData.target,
      duration: challengeData.duration,
      startDate: admin.firestore.Timestamp.fromDate(startDate),
      endDate: admin.firestore.Timestamp.fromDate(endDate),
      rewards: {
        coins: challengeData.rewards.coins,
        points: challengeData.rewards.points,
        badge: challengeData.rewards.badge
      },
      isActive: true,
      participants: [], // Will be populated with team members
      createdAt: admin.firestore.Timestamp.now(),
      aiGenerated: true,
      aiPrompt: prompt
    };
  } catch (error) {
    console.error('Error generating team challenge:', error);
    return null;
  }
}

// Create prompt for user challenge
function createUserChallengePrompt(user: InactiveUser): string {
  return `You are an AI wellness coach creating personalized challenges for inactive users.

User Profile:
- Name: ${user.displayName}
- Department: ${user.department || 'Not specified'}
- Days Inactive: ${user.daysInactive}
- Wellness Score: ${user.wellnessScore}/100
- Last Activity: ${user.lastActivity.toDate().toLocaleDateString()}

Create a personalized wellness challenge that will motivate this user to become active again. The challenge should be:
1. Appropriate for their inactivity level (${user.daysInactive} days)
2. Achievable but engaging
3. Relevant to their wellness score (${user.wellnessScore}/100)
4. Department-appropriate if specified

Respond with a JSON object in this exact format:
{
  "name": "Challenge Name (max 50 characters)",
  "description": "Detailed description (max 200 characters)",
  "type": "steps|calories|workout|streak|wellness",
  "category": "fitness|wellness|social|mindfulness|nutrition",
  "difficulty": "beginner|intermediate|advanced",
  "target": number,
  "duration": number (days, 1-14),
  "rewards": {
    "coins": number (10-100),
    "points": number (50-500),
    "badge": "Badge name (optional)"
  }
}

Make it encouraging and specific to their situation.`;
}

// Create prompt for team challenge
function createTeamChallengePrompt(team: InactiveTeam): string {
  return `You are an AI wellness coach creating team challenges for inactive teams.

Team Profile:
- Name: ${team.teamName}
- Department: ${team.department || 'Not specified'}
- Days Inactive: ${team.daysInactive}
- Member Count: ${team.memberCount}
- Average Wellness Score: ${Math.round(team.averageWellnessScore)}/100

Create a team wellness challenge that will motivate this entire team to become active again. The challenge should be:
1. Collaborative and team-oriented
2. Appropriate for their inactivity level (${team.daysInactive} days)
3. Engaging for all team members
4. Department-appropriate if specified

Respond with a JSON object in this exact format:
{
  "name": "Team Challenge Name (max 50 characters)",
  "description": "Detailed description (max 200 characters)",
  "type": "team",
  "category": "fitness|wellness|social|mindfulness|nutrition",
  "difficulty": "beginner|intermediate|advanced",
  "target": number (team total),
  "duration": number (days, 3-21),
  "rewards": {
    "coins": number (50-200 per member),
    "points": number (100-1000 per member),
    "badge": "Team Badge name (optional)"
  }
}

Make it collaborative, fun, and motivating for the whole team.`;
}

// Call OpenAI API
async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional wellness coach AI that creates personalized fitness and wellness challenges. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

// Parse AI response
function parseAIResponse(response: string, type: 'user' | 'team'): any | null {
  try {
    // Clean the response (remove any markdown formatting)
    const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanResponse);
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'type', 'category', 'difficulty', 'target', 'duration', 'rewards'];
    const hasAllFields = requiredFields.every(field => parsed[field] !== undefined);
    
    if (!hasAllFields) {
      console.error('AI response missing required fields:', parsed);
      return null;
    }
    
    // Validate field types and ranges
    if (typeof parsed.target !== 'number' || parsed.target <= 0) return null;
    if (typeof parsed.duration !== 'number' || parsed.duration < 1 || parsed.duration > 21) return null;
    if (!['steps', 'calories', 'workout', 'streak', 'wellness', 'team'].includes(parsed.type)) return null;
    if (!['fitness', 'wellness', 'social', 'mindfulness', 'nutrition'].includes(parsed.category)) return null;
    if (!['beginner', 'intermediate', 'advanced'].includes(parsed.difficulty)) return null;
    
    return parsed;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return null;
  }
}

// Manual trigger function for testing
export const createChallengeOnInactivityManual = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // Check if user is admin (you can implement your own admin check)
  const userDoc = await db.collection('users').doc(context.auth.uid).get();
  const userData = userDoc.data();
  
  if (!userData?.isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  try {
    const result = await createChallengeOnInactivity.run({});
    return result;
  } catch (error) {
    console.error('Error in manual challenge creation:', error);
    throw new functions.https.HttpsError('internal', 'Manual challenge creation failed', error);
  }
});
