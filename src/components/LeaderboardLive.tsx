import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Trophy, 
  Crown, 
  Award, 
  TrendingUp, 
  Users, 
  Calendar,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { firestoreListeners } from '@/lib/firestoreListeners';
import { 
  LeaderboardEntry, 
  TeamEntry, 
  UserProgress,
  LeaderboardLiveProps,
  PaginationInfo 
} from '@/types/leaderboard';

const LeaderboardLive: React.FC<LeaderboardLiveProps> = ({
  date,
  showTeams = false,
  showUserProgress = false,
  limit = 50,
  filters = {},
  onUserClick,
  onTeamClick,
  className = ''
}) => {
  const { user } = useAuthContext();
  
  // State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [teamEntries, setTeamEntries] = useState<TeamEntry[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: limit,
    hasNextPage: false,
    hasPreviousPage: false
  });

  // Get today's date if not provided
  const currentDate = date || new Date().toISOString().split('T')[0];

  // Error handler
  const handleError = useCallback((error: Error) => {
    console.error('Leaderboard error:', error);
    setError(error.message);
    setLoading(false);
  }, []);

  // Success handler
  const handleSuccess = useCallback(() => {
    setError(null);
    setLoading(false);
    setLastUpdated(new Date());
  }, []);

  // Subscribe to leaderboard
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = firestoreListeners.subscribeToLeaderboard(
      currentDate,
      (entries) => {
        setLeaderboard(entries);
        setPagination(prev => ({
          ...prev,
          totalItems: entries.length,
          totalPages: Math.ceil(entries.length / limit),
          hasNextPage: entries.length > limit,
          hasPreviousPage: false
        }));
        handleSuccess();
      },
      handleError
    );

    return () => {
      unsubscribe();
    };
  }, [currentDate, limit, handleError, handleSuccess]);

  // Subscribe to team leaderboard if enabled
  useEffect(() => {
    if (!showTeams) return;

    const unsubscribe = firestoreListeners.subscribeToTeamLeaderboard(
      currentDate,
      (teams) => {
        setTeamEntries(teams);
      },
      handleError
    );

    return () => {
      unsubscribe();
    };
  }, [currentDate, showTeams, handleError]);

  // Subscribe to user progress if enabled
  useEffect(() => {
    if (!showUserProgress) return;

    const unsubscribe = firestoreListeners.subscribeToUserProgress(
      (progress) => {
        setUserProgress(progress);
      },
      handleError
    );

    return () => {
      unsubscribe();
    };
  }, [showUserProgress, handleError]);

  // Get rank icon
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Award className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  // Get current user's entry
  const getCurrentUserEntry = (): LeaderboardEntry | null => {
    if (!user) return null;
    return leaderboard.find(entry => entry.uid === user.uid) || null;
  };

  // Get current user's rank
  const getCurrentUserRank = (): number | null => {
    const userEntry = getCurrentUserEntry();
    return userEntry?.rank || null;
  };

  // Refresh data
  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    // The listeners will automatically refresh the data
  }, []);

  // Get displayed entries
  const displayedEntries = showAll ? leaderboard : leaderboard.slice(0, limit);

  // Loading state
  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Live Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading leaderboard...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Live Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button onClick={refresh} className="mt-4" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Live Leaderboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {currentDate}
              </Badge>
              <Button onClick={refresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No leaderboard data available for this date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedEntries.map((entry) => (
                <div
                  key={entry.uid}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer group ${
                    entry.uid === user?.uid 
                      ? 'bg-wellness-primary/10 border border-wellness-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onUserClick?.(entry)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-wellness-primary/10 flex items-center justify-center font-semibold text-wellness-primary">
                      {entry.avatar || entry.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {entry.displayName}
                        {entry.uid === user?.uid && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                        {entry.department && (
                          <Badge variant="secondary" className="text-xs">
                            {entry.department}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.activities.steps.toLocaleString()} steps • {entry.activities.calories.toLocaleString()} cal • {entry.activities.workouts} workouts
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-wellness-primary">
                      {entry.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
              
              {leaderboard.length > limit && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => setShowAll(!showAll)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {showAll ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show All ({leaderboard.length} total)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Leaderboard */}
      {showTeams && teamEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamEntries.slice(0, 10).map((team) => (
                <div
                  key={team.teamId}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => onTeamClick?.(team)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(team.rank)}
                    </div>
                    <div>
                      <div className="font-medium">{team.teamName}</div>
                      <div className="text-sm text-muted-foreground">
                        {team.memberCount} members • Avg: {Math.round(team.averagePoints)} pts
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-wellness-primary">
                      {team.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Progress */}
      {showUserProgress && userProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              User Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userProgress.slice(0, 10).map((progress) => (
                <div
                  key={progress.uid}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-wellness-primary/10 flex items-center justify-center font-semibold text-wellness-primary">
                      {progress.avatar || progress.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{progress.displayName}</div>
                      <div className="text-sm text-muted-foreground">
                        {progress.currentStreak} day streak • {progress.totalActivities} activities
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-wellness-primary">
                      {progress.wellnessScore}
                    </div>
                    <div className="text-xs text-muted-foreground">score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current User Summary */}
      {user && getCurrentUserEntry() && (
        <Card className="bg-wellness-primary/5 border-wellness-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Your Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Rank #{getCurrentUserRank()}</div>
                <div className="text-sm text-muted-foreground">
                  {getCurrentUserEntry()?.totalPoints.toLocaleString()} points
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Activities</div>
                <div className="font-medium">
                  {getCurrentUserEntry()?.activities.steps.toLocaleString()} steps
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeaderboardLive;
