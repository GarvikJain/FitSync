import { Timestamp } from 'firebase/firestore';

// Base leaderboard entry interface
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
  avatar?: string;
  isCurrentUser?: boolean;
}

// Team leaderboard entry interface
export interface TeamEntry {
  teamId: string;
  teamName: string;
  totalPoints: number;
  rank: number;
  memberCount: number;
  averagePoints: number;
  lastUpdated: Timestamp;
  members: {
    uid: string;
    displayName: string;
    points: number;
  }[];
  department?: string;
}

// User progress interface
export interface UserProgress {
  uid: string;
  displayName: string;
  currentStreak: number;
  weeklyProgress: number;
  monthlyProgress: number;
  totalActivities: number;
  lastActivity: Timestamp;
  wellnessScore: number;
  department?: string;
  avatar?: string;
}

// Daily aggregate interface
export interface DailyAggregate {
  uid: string;
  displayName: string;
  date: string;
  totalSteps: number;
  totalCalories: number;
  totalWorkouts: number;
  wellnessScore: number;
  department?: string;
  activitiesCount: number;
  lastActivity: Timestamp;
  createdAt: Timestamp;
}

// Leaderboard document structure
export interface LeaderboardDocument {
  date: string;
  entries: LeaderboardEntry[];
  totalParticipants: number;
  createdAt: Timestamp;
  lastUpdated: Timestamp;
}

// Team leaderboard document structure
export interface TeamLeaderboardDocument {
  date: string;
  entries: TeamEntry[];
  totalTeams: number;
  createdAt: Timestamp;
  lastUpdated: Timestamp;
}

// Leaderboard filter options
export interface LeaderboardFilters {
  timeRange: 'daily' | 'weekly' | 'monthly' | 'all';
  department?: string;
  limit?: number;
  offset?: number;
}

// Leaderboard sort options
export interface LeaderboardSortOptions {
  field: 'totalPoints' | 'wellnessScore' | 'totalSteps' | 'totalCalories' | 'totalWorkouts';
  direction: 'asc' | 'desc';
}

// Pagination info
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Leaderboard state interface
export interface LeaderboardState {
  entries: LeaderboardEntry[];
  teamEntries: TeamEntry[];
  userProgress: UserProgress[];
  loading: boolean;
  error: string | null;
  filters: LeaderboardFilters;
  sortOptions: LeaderboardSortOptions;
  pagination: PaginationInfo;
  lastUpdated: Timestamp | null;
}

// Leaderboard action types
export type LeaderboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ENTRIES'; payload: LeaderboardEntry[] }
  | { type: 'SET_TEAM_ENTRIES'; payload: TeamEntry[] }
  | { type: 'SET_USER_PROGRESS'; payload: UserProgress[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<LeaderboardFilters> }
  | { type: 'SET_SORT_OPTIONS'; payload: LeaderboardSortOptions }
  | { type: 'SET_PAGINATION'; payload: PaginationInfo }
  | { type: 'UPDATE_ENTRY'; payload: { uid: string; updates: Partial<LeaderboardEntry> } }
  | { type: 'CLEAR_ERROR' };

// Leaderboard hook return type
export interface UseLeaderboardReturn {
  // Data
  entries: LeaderboardEntry[];
  teamEntries: TeamEntry[];
  userProgress: UserProgress[];
  
  // State
  loading: boolean;
  error: string | null;
  lastUpdated: Timestamp | null;
  
  // Actions
  refresh: () => void;
  setFilters: (filters: Partial<LeaderboardFilters>) => void;
  setSortOptions: (sort: LeaderboardSortOptions) => void;
  setPage: (page: number) => void;
  
  // Pagination
  pagination: PaginationInfo;
  
  // Utilities
  getCurrentUserRank: () => number | null;
  getCurrentUserEntry: () => LeaderboardEntry | null;
  getTopPerformers: (count: number) => LeaderboardEntry[];
  getDepartmentRanking: (department: string) => LeaderboardEntry[];
}

// Leaderboard component props
export interface LeaderboardLiveProps {
  date?: string;
  showTeams?: boolean;
  showUserProgress?: boolean;
  limit?: number;
  filters?: Partial<LeaderboardFilters>;
  onUserClick?: (user: LeaderboardEntry) => void;
  onTeamClick?: (team: TeamEntry) => void;
  className?: string;
}

// Team leaderboard component props
export interface TeamLeaderboardProps {
  date?: string;
  limit?: number;
  showMemberDetails?: boolean;
  onTeamClick?: (team: TeamEntry) => void;
  className?: string;
}

// User progress component props
export interface UserProgressProps {
  uid?: string;
  limit?: number;
  showStreaks?: boolean;
  showProgress?: boolean;
  onUserClick?: (user: UserProgress) => void;
  className?: string;
}

// Leaderboard statistics
export interface LeaderboardStats {
  totalUsers: number;
  totalTeams: number;
  averagePoints: number;
  topPerformer: LeaderboardEntry | null;
  mostActiveDepartment: string | null;
  totalActivities: number;
  dateRange: {
    start: Timestamp;
    end: Timestamp;
  };
}

// Export all types as a namespace for easier imports
export namespace LeaderboardTypes {
  export type Entry = LeaderboardEntry;
  export type TeamEntry = TeamEntry;
  export type UserProgress = UserProgress;
  export type DailyAggregate = DailyAggregate;
  export type Document = LeaderboardDocument;
  export type TeamDocument = TeamLeaderboardDocument;
  export type Filters = LeaderboardFilters;
  export type SortOptions = LeaderboardSortOptions;
  export type Pagination = PaginationInfo;
  export type State = LeaderboardState;
  export type Action = LeaderboardAction;
  export type HookReturn = UseLeaderboardReturn;
  export type LiveProps = LeaderboardLiveProps;
  export type TeamProps = TeamLeaderboardProps;
  export type ProgressProps = UserProgressProps;
  export type Stats = LeaderboardStats;
}
