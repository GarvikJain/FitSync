import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  Unsubscribe,
  DocumentSnapshot,
  QuerySnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Type definitions
export interface Activity {
  id: string;
  uid: string;
  type: 'steps' | 'calories' | 'workout' | 'challenge' | 'wellness';
  value: number;
  timestamp: Timestamp;
  metadata?: Record<string, any>;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  coinsRequired: number;
  category: 'fitness' | 'wellness' | 'social' | 'achievement';
  isActive: boolean;
  createdAt: Timestamp;
  imageUrl?: string;
}

export interface UserReward {
  id: string;
  uid: string;
  rewardId: string;
  rewardName: string;
  coinsSpent: number;
  redeemedAt: Timestamp;
  isRedeemed: boolean;
}

export interface LeaderboardEntry {
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
  lastUpdated: Timestamp;
}

export interface TeamEntry {
  teamId: string;
  teamName: string;
  totalPoints: number;
  rank: number;
  memberCount: number;
  averagePoints: number;
  lastUpdated: Timestamp;
}

export interface UserProgress {
  uid: string;
  displayName: string;
  currentStreak: number;
  weeklyProgress: number;
  monthlyProgress: number;
  totalActivities: number;
  lastActivity: Timestamp;
}

// Listener callback types
export type ActivityListenerCallback = (activities: Activity[]) => void;
export type RewardListenerCallback = (rewards: Reward[]) => void;
export type UserRewardListenerCallback = (userRewards: UserReward[]) => void;
export type LeaderboardListenerCallback = (leaderboard: LeaderboardEntry[]) => void;
export type TeamLeaderboardListenerCallback = (teams: TeamEntry[]) => void;
export type UserProgressListenerCallback = (progress: UserProgress[]) => void;

// Error callback type
export type ErrorCallback = (error: Error) => void;

// Real-time listener helpers
export class FirestoreListeners {
  private activeListeners: Map<string, Unsubscribe> = new Map();

  // Subscribe to user activities
  subscribeToUserActivities(
    uid: string,
    callback: ActivityListenerCallback,
    errorCallback?: ErrorCallback,
    limitCount: number = 50
  ): Unsubscribe {
    const listenerKey = `user-activities-${uid}`;
    
    // Unsubscribe existing listener if any
    this.unsubscribe(listenerKey);

    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const activities: Activity[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Activity));
        callback(activities);
      },
      (error) => {
        console.error('Error listening to user activities:', error);
        errorCallback?.(error);
      }
    );

    this.activeListeners.set(listenerKey, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to global activities (for admin/leaderboard purposes)
  subscribeToGlobalActivities(
    callback: ActivityListenerCallback,
    errorCallback?: ErrorCallback,
    limitCount: number = 100
  ): Unsubscribe {
    const listenerKey = 'global-activities';
    
    this.unsubscribe(listenerKey);

    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const activities: Activity[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Activity));
        callback(activities);
      },
      (error) => {
        console.error('Error listening to global activities:', error);
        errorCallback?.(error);
      }
    );

    this.activeListeners.set(listenerKey, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to all active rewards
  subscribeToRewards(
    callback: RewardListenerCallback,
    errorCallback?: ErrorCallback
  ): Unsubscribe {
    const listenerKey = 'rewards';
    
    this.unsubscribe(listenerKey);

    const rewardsRef = collection(db, 'rewards');
    const q = query(
      rewardsRef,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const rewards: Reward[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Reward));
        callback(rewards);
      },
      (error) => {
        console.error('Error listening to rewards:', error);
        errorCallback?.(error);
      }
    );

    this.activeListeners.set(listenerKey, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to user-specific rewards
  subscribeToUserRewards(
    uid: string,
    callback: UserRewardListenerCallback,
    errorCallback?: ErrorCallback
  ): Unsubscribe {
    const listenerKey = `user-rewards-${uid}`;
    
    this.unsubscribe(listenerKey);

    const userRewardsRef = collection(db, 'userRewards');
    const q = query(
      userRewardsRef,
      where('uid', '==', uid),
      orderBy('redeemedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const userRewards: UserReward[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as UserReward));
        callback(userRewards);
      },
      (error) => {
        console.error('Error listening to user rewards:', error);
        errorCallback?.(error);
      }
    );

    this.activeListeners.set(listenerKey, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to daily leaderboard
  subscribeToLeaderboard(
    date: string,
    callback: LeaderboardListenerCallback,
    errorCallback?: ErrorCallback
  ): Unsubscribe {
    const listenerKey = `leaderboard-${date}`;
    
    this.unsubscribe(listenerKey);

    const leaderboardRef = collection(db, 'leaderboards');
    const leaderboardDoc = leaderboardRef.doc(date);

    const unsubscribe = onSnapshot(
      leaderboardDoc,
      (snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const leaderboard: LeaderboardEntry[] = data?.entries || [];
          callback(leaderboard);
        } else {
          callback([]);
        }
      },
      (error) => {
        console.error('Error listening to leaderboard:', error);
        errorCallback?.(error);
      }
    );

    this.activeListeners.set(listenerKey, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to team leaderboard
  subscribeToTeamLeaderboard(
    date: string,
    callback: TeamLeaderboardListenerCallback,
    errorCallback?: ErrorCallback
  ): Unsubscribe {
    const listenerKey = `team-leaderboard-${date}`;
    
    this.unsubscribe(listenerKey);

    const teamLeaderboardRef = collection(db, 'teamLeaderboards');
    const teamLeaderboardDoc = teamLeaderboardRef.doc(date);

    const unsubscribe = onSnapshot(
      teamLeaderboardDoc,
      (snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const teams: TeamEntry[] = data?.entries || [];
          callback(teams);
        } else {
          callback([]);
        }
      },
      (error) => {
        console.error('Error listening to team leaderboard:', error);
        errorCallback?.(error);
      }
    );

    this.activeListeners.set(listenerKey, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to user progress
  subscribeToUserProgress(
    callback: UserProgressListenerCallback,
    errorCallback?: ErrorCallback,
    limitCount: number = 50
  ): Unsubscribe {
    const listenerKey = 'user-progress';
    
    this.unsubscribe(listenerKey);

    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      orderBy('wellnessScore', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const progress: UserProgress[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            uid: doc.id,
            displayName: data.displayName || 'Unknown User',
            currentStreak: data.currentStreak || 0,
            weeklyProgress: data.weeklyProgress || 0,
            monthlyProgress: data.monthlyProgress || 0,
            totalActivities: data.totalActivities || 0,
            lastActivity: data.lastActive || Timestamp.now()
          };
        });
        callback(progress);
      },
      (error) => {
        console.error('Error listening to user progress:', error);
        errorCallback?.(error);
      }
    );

    this.activeListeners.set(listenerKey, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to daily aggregates for a specific user
  subscribeToUserDailyAggregates(
    uid: string,
    callback: (aggregates: any[]) => void,
    errorCallback?: ErrorCallback,
    limitCount: number = 30
  ): Unsubscribe {
    const listenerKey = `user-daily-aggregates-${uid}`;
    
    this.unsubscribe(listenerKey);

    const aggregatesRef = collection(db, 'dailyAggregates');
    const q = query(
      aggregatesRef,
      where('uid', '==', uid),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const aggregates = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(aggregates);
      },
      (error) => {
        console.error('Error listening to user daily aggregates:', error);
        errorCallback?.(error);
      }
    );

    this.activeListeners.set(listenerKey, unsubscribe);
    return unsubscribe;
  }

  // Unsubscribe from a specific listener
  unsubscribe(listenerKey: string): void {
    const unsubscribe = this.activeListeners.get(listenerKey);
    if (unsubscribe) {
      unsubscribe();
      this.activeListeners.delete(listenerKey);
    }
  }

  // Unsubscribe from all listeners
  unsubscribeAll(): void {
    this.activeListeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.activeListeners.clear();
  }

  // Get active listener count
  getActiveListenerCount(): number {
    return this.activeListeners.size;
  }

  // Get list of active listener keys
  getActiveListenerKeys(): string[] {
    return Array.from(this.activeListeners.keys());
  }
}

// Export singleton instance
export const firestoreListeners = new FirestoreListeners();

// Export individual functions for convenience
export const {
  subscribeToUserActivities,
  subscribeToGlobalActivities,
  subscribeToRewards,
  subscribeToUserRewards,
  subscribeToLeaderboard,
  subscribeToTeamLeaderboard,
  subscribeToUserProgress,
  subscribeToUserDailyAggregates,
  unsubscribe,
  unsubscribeAll
} = firestoreListeners;

export default firestoreListeners;
