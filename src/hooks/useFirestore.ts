import { useState, useEffect, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import { firestoreService } from '@/lib/firestore';
import { LoadingState, UserProfile, Activity, Challenge, LeaderboardEntry, WellnessMetrics, Notification } from '@/types';

// Generic hook for Firestore operations
export const useFirestoreOperation = <T>(
  operation: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = []
) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await operation();
      
      if (result.success) {
        setData(result.data || null);
        setState({ isLoading: false, error: null, lastUpdated: Timestamp.now() });
      } else {
        setState({ isLoading: false, error: result.error || 'Operation failed', lastUpdated: Timestamp.now() });
      }
    } catch (error) {
      setState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        lastUpdated: Timestamp.now()
      });
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, data, refetch: execute };
};

// User Profile Hook
export const useUserProfile = (uid: string | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [state, setState] = useState<LoadingState>({ isLoading: true, error: null });

  const fetchProfile = useCallback(async () => {
    if (!uid) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await firestoreService.user.getProfile(uid);
    
    if (result.success && result.data) {
      setProfile(result.data);
      setState({ isLoading: false, error: null, lastUpdated: Timestamp.now() });
    } else {
      setState({ isLoading: false, error: result.error || 'Failed to fetch profile', lastUpdated: Timestamp.now() });
    }
  }, [uid]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!uid) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await firestoreService.user.createOrUpdateProfile({ ...updates, uid });
    
    if (result.success && result.data) {
      setProfile(result.data);
      setState({ isLoading: false, error: null, lastUpdated: Timestamp.now() });
    } else {
      setState({ isLoading: false, error: result.error || 'Failed to update profile', lastUpdated: Timestamp.now() });
    }
  }, [uid]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, ...state, updateProfile, refetch: fetchProfile };
};

// Real-time User Profile Hook
export const useRealtimeUserProfile = (uid: string | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [state, setState] = useState<LoadingState>({ isLoading: true, error: null });

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setState({ isLoading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const subscription = firestoreService.user.subscribeToProfile(uid, (profileData) => {
      setProfile(profileData);
      setState({ isLoading: false, error: null, lastUpdated: Timestamp.now() });
    });

    return () => subscription.unsubscribe();
  }, [uid]);

  return { profile, ...state };
};

// Activities Hook
export const useUserActivities = (uid: string | null, limit: number = 20) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [state, setState] = useState<LoadingState>({ isLoading: true, error: null });

  const fetchActivities = useCallback(async () => {
    if (!uid) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await firestoreService.activity.getUserActivities(uid, { limit, orderBy: 'timestamp', orderDirection: 'desc' });
    
    if (result.success && result.data) {
      setActivities(result.data);
      setState({ isLoading: false, error: null, lastUpdated: Timestamp.now() });
    } else {
      setState({ isLoading: false, error: result.error || 'Failed to fetch activities', lastUpdated: Timestamp.now() });
    }
  }, [uid, limit]);

  const addActivity = useCallback(async (activity: Omit<Activity, 'id' | 'timestamp' | 'uid'>) => {
    if (!uid) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await firestoreService.activity.addActivity({ ...activity, uid });
    
    if (result.success) {
      // Refresh activities
      await fetchActivities();
    } else {
      setState(prev => ({ ...prev, isLoading: false, error: result.error || 'Failed to add activity' }));
    }
  }, [uid, fetchActivities]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, ...state, addActivity, refetch: fetchActivities };
};

// Real-time Activities Hook
export const useRealtimeUserActivities = (uid: string | null, limit: number = 20) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [state, setState] = useState<LoadingState>({ isLoading: true, error: null });

  useEffect(() => {
    if (!uid) {
      setActivities([]);
      setState({ isLoading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const subscription = firestoreService.activity.subscribeToUserActivities(uid, (activitiesData) => {
      setActivities(activitiesData);
      setState({ isLoading: false, error: null, lastUpdated: Timestamp.now() });
    }, limit);

    return () => subscription.unsubscribe();
  }, [uid, limit]);

  return { activities, ...state };
};

// Leaderboard Hook
export const useLeaderboard = (limit: number = 10) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [state, setState] = useState<LoadingState>({ isLoading: true, error: null });

  const fetchLeaderboard = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await firestoreService.leaderboard.getLeaderboard(limit);
    
    if (result.success && result.data) {
      setLeaderboard(result.data);
      setState({ isLoading: false, error: null, lastUpdated: Timestamp.now() });
    } else {
      setState({ isLoading: false, error: result.error || 'Failed to fetch leaderboard', lastUpdated: Timestamp.now() });
    }
  }, [limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { leaderboard, ...state, refetch: fetchLeaderboard };
};

// Real-time Leaderboard Hook
export const useRealtimeLeaderboard = (limit: number = 10) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [state, setState] = useState<LoadingState>({ isLoading: true, error: null });

  useEffect(() => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const subscription = firestoreService.leaderboard.subscribeToLeaderboard((leaderboardData) => {
      setLeaderboard(leaderboardData);
      setState({ isLoading: false, error: null, lastUpdated: Timestamp.now() });
    }, limit);

    return () => subscription.unsubscribe();
  }, [limit]);

  return { leaderboard, ...state };
};

// Challenges Hook
export const useChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [state, setState] = useState<LoadingState>({ isLoading: true, error: null });

  const fetchChallenges = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await firestoreService.challenge.getActiveChallenges();
    
    if (result.success && result.data) {
      setChallenges(result.data);
      setState({ isLoading: false, error: null, lastUpdated: Timestamp.now() });
    } else {
      setState({ isLoading: false, error: result.error || 'Failed to fetch challenges', lastUpdated: Timestamp.now() });
    }
  }, []);

  const joinChallenge = useCallback(async (challengeId: string, uid: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await firestoreService.challenge.joinChallenge(challengeId, uid);
    
    if (result.success) {
      await fetchChallenges();
    } else {
      setState(prev => ({ ...prev, isLoading: false, error: result.error || 'Failed to join challenge' }));
    }
  }, [fetchChallenges]);

  const leaveChallenge = useCallback(async (challengeId: string, uid: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await firestoreService.challenge.leaveChallenge(challengeId, uid);
    
    if (result.success) {
      await fetchChallenges();
    } else {
      setState(prev => ({ ...prev, isLoading: false, error: result.error || 'Failed to leave challenge' }));
    }
  }, [fetchChallenges]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  return { challenges, ...state, joinChallenge, leaveChallenge, refetch: fetchChallenges };
};

// Wellness Metrics Hook
export const useWellnessMetrics = (uid: string | null, startDate: string, endDate: string) => {
  const [metrics, setMetrics] = useState<WellnessMetrics[]>([]);
  const [state, setState] = useState<LoadingState>({ isLoading: true, error: null });

  const fetchMetrics = useCallback(async () => {
    if (!uid) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await firestoreService.wellness.getUserMetrics(uid, startDate, endDate);
    
    if (result.success && result.data) {
      setMetrics(result.data);
      setState({ isLoading: false, error: null, lastUpdated: Timestamp.now() });
    } else {
      setState({ isLoading: false, error: result.error || 'Failed to fetch metrics', lastUpdated: Timestamp.now() });
    }
  }, [uid, startDate, endDate]);

  const addMetrics = useCallback(async (metricsData: Omit<WellnessMetrics, 'timestamp' | 'uid'>) => {
    if (!uid) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await firestoreService.wellness.addDailyMetrics({ ...metricsData, uid });
    
    if (result.success) {
      await fetchMetrics();
    } else {
      setState(prev => ({ ...prev, isLoading: false, error: result.error || 'Failed to add metrics' }));
    }
  }, [uid, fetchMetrics]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, ...state, addMetrics, refetch: fetchMetrics };
};

// Notifications Hook
export const useNotifications = (uid: string | null, limit: number = 20) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [state, setState] = useState<LoadingState>({ isLoading: true, error: null });

  const fetchNotifications = useCallback(async () => {
    if (!uid) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await firestoreService.notification.getUserNotifications(uid, limit);
    
    if (result.success && result.data) {
      setNotifications(result.data);
      setState({ isLoading: false, error: null, lastUpdated: Timestamp.now() });
    } else {
      setState({ isLoading: false, error: result.error || 'Failed to fetch notifications', lastUpdated: Timestamp.now() });
    }
  }, [uid, limit]);

  const markAsRead = useCallback(async (notificationId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await firestoreService.notification.markAsRead(notificationId);
    
    if (result.success) {
      await fetchNotifications();
    } else {
      setState(prev => ({ ...prev, isLoading: false, error: result.error || 'Failed to mark notification as read' }));
    }
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, ...state, markAsRead, refetch: fetchNotifications };
};

// Custom hook for error handling
export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: any) => {
    const errorMessage = error?.message || error?.error || 'An unknown error occurred';
    setError(errorMessage);
    console.error('Error:', errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};
