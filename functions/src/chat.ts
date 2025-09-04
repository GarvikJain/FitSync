import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

interface TeamMessage {
  uid: string;
  displayName: string;
  message: string;
  timestamp: admin.firestore.Timestamp;
  teamId: string;
  messageType: 'text' | 'image' | 'file';
  replyTo?: string;
}

interface Team {
  id: string;
  name: string;
  members: string[];
  admins: string[];
  createdAt: admin.firestore.Timestamp;
}

export const postTeamMessage = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to post messages'
    );
  }

  const { teamId, message, messageType = 'text', replyTo } = data;
  const uid = context.auth.uid;

  // Validate input
  if (!teamId || !message) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Team ID and message are required'
    );
  }

  if (message.length > 1000) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Message too long (max 1000 characters)'
    );
  }

  try {
    // Verify user is member of the team
    const teamDoc = await db.collection('teams').doc(teamId).get();
    
    if (!teamDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Team not found'
      );
    }

    const teamData = teamDoc.data() as Team;
    
    if (!teamData.members.includes(uid)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'User is not a member of this team'
      );
    }

    // Get user profile for display name
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();
    const displayName = userData?.displayName || 'Anonymous User';

    // Create message object
    const messageData: TeamMessage = {
      uid,
      displayName,
      message: message.trim(),
      timestamp: admin.firestore.Timestamp.now(),
      teamId,
      messageType,
      replyTo: replyTo || null
    };

    // Save message to team's messages subcollection
    const messageRef = await db
      .collection('teams')
      .doc(teamId)
      .collection('messages')
      .add(messageData);

    // Update team's last activity
    await db.collection('teams').doc(teamId).update({
      lastActivity: admin.firestore.Timestamp.now(),
      lastMessage: {
        uid,
        displayName,
        message: message.length > 50 ? message.substring(0, 50) + '...' : message,
        timestamp: admin.firestore.Timestamp.now()
      }
    });

    // Create notification for team members (except sender)
    const notificationPromises = teamData.members
      .filter(memberId => memberId !== uid)
      .map(memberId => 
        db.collection('notifications').add({
          uid: memberId,
          type: 'social',
          title: 'New Team Message',
          message: `${displayName} sent a message in ${teamData.name}`,
          isRead: false,
          actionUrl: `/teams/${teamId}`,
          createdAt: admin.firestore.Timestamp.now(),
          expiresAt: admin.firestore.Timestamp.fromDate(
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          )
        })
      );

    await Promise.all(notificationPromises);

    console.log(`Message posted to team ${teamId} by user ${uid}`);

    return {
      success: true,
      messageId: messageRef.id,
      timestamp: messageData.timestamp
    };

  } catch (error) {
    console.error('Error posting team message:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Failed to post message',
      error
    );
  }
});

// Function to get team messages with pagination
export const getTeamMessages = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { teamId, limit = 50, startAfter } = data;
  const uid = context.auth.uid;

  try {
    // Verify user is member of the team
    const teamDoc = await db.collection('teams').doc(teamId).get();
    
    if (!teamDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Team not found');
    }

    const teamData = teamDoc.data() as Team;
    
    if (!teamData.members.includes(uid)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'User is not a member of this team'
      );
    }

    // Build query
    let query = db
      .collection('teams')
      .doc(teamId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(limit);

    if (startAfter) {
      query = query.startAfter(startAfter);
    }

    const messagesSnapshot = await query.get();
    
    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      messages,
      hasMore: messagesSnapshot.docs.length === limit,
      lastDoc: messagesSnapshot.docs[messagesSnapshot.docs.length - 1]
    };

  } catch (error) {
    console.error('Error getting team messages:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Failed to get messages',
      error
    );
  }
});
