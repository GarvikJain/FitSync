import { Timestamp } from 'firebase/firestore';

// User Profile Interface
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  totalSteps: number;
  totalCalories: number;
  totalWorkouts: number;
  challengesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  wellnessScore: number;
  department?: string;
  position?: string;
  joinDate: Timestamp;
  lastActive: Timestamp;
  preferences: {
    notifications: boolean;
    privacy: 'public' | 'private' | 'team';
    units: 'metric' | 'imperial';
  };
}

// Activity Interface
export interface Activity {
  id: string;
  uid: string;
  type: 'steps' | 'calories' | 'workout' | 'challenge' | 'wellness';
  value: number;
  description?: string;
  timestamp: Timestamp;
  metadata?: {
    duration?: number; // in minutes
    intensity?: 'low' | 'medium' | 'high';
    category?: string;
    location?: string;
  };
}

// Challenge Interface
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'steps' | 'calories' | 'workout' | 'streak' | 'custom';
  target: number;
  duration: number; // in days
  startDate: Timestamp;
  endDate: Timestamp;
  participants: string[]; // array of user UIDs
  rewards: {
    coins: number;
    badge?: string;
    title?: string;
  };
  isActive: boolean;
  createdBy: string; // admin UID
  createdAt: Timestamp;
}

// Leaderboard Entry Interface
export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL?: string;
  totalPoints: number;
  rank: number;
  change: number; // change from previous period
  activities: {
    steps: number;
    calories: number;
    workouts: number;
  };
  lastUpdated: Timestamp;
}

// Wellness Metrics Interface
export interface WellnessMetrics {
  uid: string;
  date: string; // YYYY-MM-DD format
  steps: number;
  calories: number;
  activeMinutes: number;
  sleepHours?: number;
  waterIntake?: number; // in glasses
  mood?: 'excellent' | 'good' | 'okay' | 'poor' | 'terrible';
  stressLevel?: 'low' | 'medium' | 'high';
  energyLevel?: 'high' | 'medium' | 'low';
  notes?: string;
  timestamp: Timestamp;
}

// Team/Department Interface
export interface Team {
  id: string;
  name: string;
  description?: string;
  members: string[]; // array of user UIDs
  admins: string[]; // array of admin UIDs
  challenges: string[]; // array of challenge IDs
  createdAt: Timestamp;
  createdBy: string;
}

// Notification Interface
export interface Notification {
  id: string;
  uid: string;
  type: 'achievement' | 'challenge' | 'reminder' | 'social' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
}

// API Response Interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Loading State Interface
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: Timestamp;
}

// Pagination Interface
export interface PaginationOptions {
  limit: number;
  startAfter?: any; // Firestore document snapshot
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}

// Real-time Subscription Interface
export interface RealtimeSubscription {
  unsubscribe: () => void;
  error?: string;
}

// Database Error Interface
export interface DatabaseError {
  code: string;
  message: string;
  details?: any;
}

// Activity Summary Interface
export interface ActivitySummary {
  totalSteps: number;
  totalCalories: number;
  totalWorkouts: number;
  averageSteps: number;
  averageCalories: number;
  averageWorkouts: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Timestamp;
  endDate: Timestamp;
}

// Challenge Progress Interface
export interface ChallengeProgress {
  challengeId: string;
  uid: string;
  currentProgress: number;
  target: number;
  percentage: number;
  isCompleted: boolean;
  completedAt?: Timestamp;
  lastUpdated: Timestamp;
}

// Export all interfaces as a single object for easier imports
export const Types = {
  UserProfile,
  Activity,
  Challenge,
  LeaderboardEntry,
  WellnessMetrics,
  Team,
  Notification,
  ApiResponse,
  LoadingState,
  PaginationOptions,
  RealtimeSubscription,
  DatabaseError,
  ActivitySummary,
  ChallengeProgress,
} as const;
