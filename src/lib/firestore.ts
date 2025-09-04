import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  Timestamp,
  writeBatch,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  DocumentSnapshot,
  QuerySnapshot,
  Unsubscribe,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  UserProfile,
  Activity,
  Challenge,
  LeaderboardEntry,
  WellnessMetrics,
  Team,
  Notification,
  ActivitySummary,
  ChallengeProgress,
  ApiResponse,
  LoadingState,
  PaginationOptions,
  RealtimeSubscription,
  DatabaseError,
} from '@/types';

// Error handling utility
const handleFirestoreError = (error: any): DatabaseError => {
  console.error('Firestore error:', error);
  return {
    code: error.code || 'unknown',
    message: error.message || 'An unknown error occurred',
    details: error,
  };
};

// User Profile Operations
export const userService = {
  // Create or update user profile
  async createOrUpdateProfile(profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      if (!profile.uid) {
        throw new Error('User ID is required');
      }

      const userRef = doc(db, 'users', profile.uid);
      const userData = {
        ...profile,
        lastActive: serverTimestamp(),
        joinDate: profile.joinDate || serverTimestamp(),
      };

      await setDoc(userRef, userData, { merge: true });
      
      return {
        success: true,
        data: userData as UserProfile,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Get user profile
  async getProfile(uid: string): Promise<ApiResponse<UserProfile>> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return {
          success: false,
          error: 'User profile not found',
        };
      }

      return {
        success: true,
        data: userSnap.data() as UserProfile,
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Update user wellness score
  async updateWellnessScore(uid: string, score: number): Promise<ApiResponse<void>> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        wellnessScore: score,
        lastActive: serverTimestamp(),
      });

      return {
        success: true,
        message: 'Wellness score updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Subscribe to user profile changes
  subscribeToProfile(uid: string, callback: (profile: UserProfile | null) => void): RealtimeSubscription {
    const userRef = doc(db, 'users', uid);
    
    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          callback(snap.data() as UserProfile);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Profile subscription error:', error);
        callback(null);
      }
    );

    return { unsubscribe };
  },
};

// Activity Operations
export const activityService = {
  // Add new activity
  async addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<ApiResponse<Activity>> {
    try {
      const activitiesRef = collection(db, 'activities');
      const activityData = {
        ...activity,
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(activitiesRef, activityData);
      
      // Update user totals
      await this.updateUserTotals(activity.uid, activity.type, activity.value);

      return {
        success: true,
        data: { ...activityData, id: docRef.id, timestamp: activityData.timestamp } as Activity,
        message: 'Activity added successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Get user activities with pagination
  async getUserActivities(
    uid: string,
    options: PaginationOptions = { limit: 20, orderBy: 'timestamp', orderDirection: 'desc' }
  ): Promise<ApiResponse<Activity[]>> {
    try {
      const activitiesRef = collection(db, 'activities');
      const constraints: QueryConstraint[] = [
        where('uid', '==', uid),
        orderBy(options.orderBy, options.orderDirection),
        limit(options.limit),
      ];

      if (options.startAfter) {
        constraints.push(startAfter(options.startAfter));
      }

      const q = query(activitiesRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      const activities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Activity[];

      return {
        success: true,
        data: activities,
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Get activities by type
  async getActivitiesByType(
    uid: string,
    type: Activity['type'],
    limitCount: number = 10
  ): Promise<ApiResponse<Activity[]>> {
    try {
      const activitiesRef = collection(db, 'activities');
      const q = query(
        activitiesRef,
        where('uid', '==', uid),
        where('type', '==', type),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const activities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Activity[];

      return {
        success: true,
        data: activities,
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Update user totals when activity is added
  async updateUserTotals(uid: string, type: Activity['type'], value: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const updates: any = { lastActive: serverTimestamp() };

      switch (type) {
        case 'steps':
          updates.totalSteps = increment(value);
          break;
        case 'calories':
          updates.totalCalories = increment(value);
          break;
        case 'workout':
          updates.totalWorkouts = increment(1);
          break;
      }

      await updateDoc(userRef, updates);
    } catch (error) {
      console.error('Error updating user totals:', error);
    }
  },

  // Subscribe to user activities
  subscribeToUserActivities(
    uid: string,
    callback: (activities: Activity[]) => void,
    limitCount: number = 20
  ): RealtimeSubscription {
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Activity[];
        callback(activities);
      },
      (error) => {
        console.error('Activities subscription error:', error);
        callback([]);
      }
    );

    return { unsubscribe };
  },
};

// Leaderboard Operations
export const leaderboardService = {
  // Get real-time leaderboard
  async getLeaderboard(limitCount: number = 10): Promise<ApiResponse<LeaderboardEntry[]>> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        orderBy('wellnessScore', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const leaderboard: LeaderboardEntry[] = [];

      querySnapshot.docs.forEach((doc, index) => {
        const userData = doc.data() as UserProfile;
        leaderboard.push({
          uid: userData.uid,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          totalPoints: userData.wellnessScore,
          rank: index + 1,
          change: 0, // This would need to be calculated based on previous period
          activities: {
            steps: userData.totalSteps,
            calories: userData.totalCalories,
            workouts: userData.totalWorkouts,
          },
          lastUpdated: userData.lastActive,
        });
      });

      return {
        success: true,
        data: leaderboard,
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Subscribe to real-time leaderboard
  subscribeToLeaderboard(
    callback: (leaderboard: LeaderboardEntry[]) => void,
    limitCount: number = 10
  ): RealtimeSubscription {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      orderBy('wellnessScore', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const leaderboard: LeaderboardEntry[] = [];
        snapshot.docs.forEach((doc, index) => {
          const userData = doc.data() as UserProfile;
          leaderboard.push({
            uid: userData.uid,
            displayName: userData.displayName,
            photoURL: userData.photoURL,
            totalPoints: userData.wellnessScore,
            rank: index + 1,
            change: 0,
            activities: {
              steps: userData.totalSteps,
              calories: userData.totalCalories,
              workouts: userData.totalWorkouts,
            },
            lastUpdated: userData.lastActive,
          });
        });
        callback(leaderboard);
      },
      (error) => {
        console.error('Leaderboard subscription error:', error);
        callback([]);
      }
    );

    return { unsubscribe };
  },
};

// Challenge Operations
export const challengeService = {
  // Create new challenge
  async createChallenge(challenge: Omit<Challenge, 'id' | 'createdAt'>): Promise<ApiResponse<Challenge>> {
    try {
      const challengesRef = collection(db, 'challenges');
      const challengeData = {
        ...challenge,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(challengesRef, challengeData);

      return {
        success: true,
        data: { ...challengeData, id: docRef.id, createdAt: challengeData.createdAt } as Challenge,
        message: 'Challenge created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Get active challenges
  async getActiveChallenges(): Promise<ApiResponse<Challenge[]>> {
    try {
      const challengesRef = collection(db, 'challenges');
      const q = query(
        challengesRef,
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const challenges = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Challenge[];

      return {
        success: true,
        data: challenges,
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Join challenge
  async joinChallenge(challengeId: string, uid: string): Promise<ApiResponse<void>> {
    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      await updateDoc(challengeRef, {
        participants: arrayUnion(uid),
      });

      return {
        success: true,
        message: 'Successfully joined challenge',
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Leave challenge
  async leaveChallenge(challengeId: string, uid: string): Promise<ApiResponse<void>> {
    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      await updateDoc(challengeRef, {
        participants: arrayRemove(uid),
      });

      return {
        success: true,
        message: 'Successfully left challenge',
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },
};

// Wellness Metrics Operations
export const wellnessService = {
  // Add daily wellness metrics
  async addDailyMetrics(metrics: Omit<WellnessMetrics, 'timestamp'>): Promise<ApiResponse<WellnessMetrics>> {
    try {
      const metricsRef = collection(db, 'wellnessMetrics');
      const metricsData = {
        ...metrics,
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(metricsRef, metricsData);

      return {
        success: true,
        data: { ...metricsData, timestamp: metricsData.timestamp } as WellnessMetrics,
        message: 'Wellness metrics added successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Get user wellness metrics for date range
  async getUserMetrics(
    uid: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<WellnessMetrics[]>> {
    try {
      const metricsRef = collection(db, 'wellnessMetrics');
      const q = query(
        metricsRef,
        where('uid', '==', uid),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const metrics = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as WellnessMetrics[];

      return {
        success: true,
        data: metrics,
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },
};

// Notification Operations
export const notificationService = {
  // Create notification
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<ApiResponse<Notification>> {
    try {
      const notificationsRef = collection(db, 'notifications');
      const notificationData = {
        ...notification,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(notificationsRef, notificationData);

      return {
        success: true,
        data: { ...notificationData, id: docRef.id, createdAt: notificationData.createdAt } as Notification,
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Get user notifications
  async getUserNotifications(uid: string, limitCount: number = 20): Promise<ApiResponse<Notification[]>> {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('uid', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];

      return {
        success: true,
        data: notifications,
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
      });

      return {
        success: true,
        message: 'Notification marked as read',
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },
};

// Batch Operations
export const batchService = {
  // Add multiple activities in batch
  async addMultipleActivities(activities: Omit<Activity, 'id' | 'timestamp'>[]): Promise<ApiResponse<void>> {
    try {
      const batch = writeBatch(db);
      const activitiesRef = collection(db, 'activities');

      activities.forEach(activity => {
        const docRef = doc(activitiesRef);
        batch.set(docRef, {
          ...activity,
          timestamp: serverTimestamp(),
        });
      });

      await batch.commit();

      return {
        success: true,
        message: 'Activities added successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirestoreError(error).message,
      };
    }
  },
};

// Export all services
export const firestoreService = {
  user: userService,
  activity: activityService,
  leaderboard: leaderboardService,
  challenge: challengeService,
  wellness: wellnessService,
  notification: notificationService,
  batch: batchService,
};
