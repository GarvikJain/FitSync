import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Database, User, Activity, Trophy } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRealtimeUserProfile, useRealtimeUserActivities, useRealtimeLeaderboard } from '@/hooks/useFirestore';
import { firestoreService } from '@/lib/firestore';

const DatabaseTest = () => {
  const { user, isAuthenticated } = useAuthContext();
  const { profile, isLoading: profileLoading, error: profileError } = useRealtimeUserProfile(user?.uid || null);
  const { activities, isLoading: activitiesLoading } = useRealtimeUserActivities(user?.uid || null, 5);
  const { leaderboard, isLoading: leaderboardLoading } = useRealtimeLeaderboard(5);
  
  const [testResults, setTestResults] = useState<{ [key: string]: { success: boolean; message: string } }>({});
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setIsRunning(true);
    try {
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, message: result.message || 'Test passed' }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { 
          success: false, 
          message: error instanceof Error ? error.message : 'Test failed' 
        }
      }));
    } finally {
      setIsRunning(false);
    }
  };

  const testCreateProfile = async () => {
    if (!user) throw new Error('User not authenticated');
    
    const result = await firestoreService.user.createOrUpdateProfile({
      uid: user.uid,
      displayName: user.displayName || 'Test User',
      email: user.email || 'test@example.com',
      photoURL: user.photoURL || undefined,
      totalSteps: 0,
      totalCalories: 0,
      totalWorkouts: 0,
      challengesCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      wellnessScore: 0,
      joinDate: new Date() as any,
      lastActive: new Date() as any,
      preferences: {
        notifications: true,
        privacy: 'public' as const,
        units: 'metric' as const,
      },
    });
    
    if (!result.success) throw new Error(result.error);
    return result;
  };

  const testAddActivity = async () => {
    if (!user) throw new Error('User not authenticated');
    
    const result = await firestoreService.activity.addActivity({
      uid: user.uid,
      type: 'steps',
      value: Math.floor(Math.random() * 5000) + 1000,
      description: 'Test activity from DatabaseTest component',
    });
    
    if (!result.success) throw new Error(result.error);
    return result;
  };

  const testGetLeaderboard = async () => {
    const result = await firestoreService.leaderboard.getLeaderboard(5);
    if (!result.success) throw new Error(result.error);
    return result;
  };

  const testCreateChallenge = async () => {
    if (!user) throw new Error('User not authenticated');
    
    const result = await firestoreService.challenge.createChallenge({
      title: 'Test Challenge',
      description: 'A test challenge created from DatabaseTest component',
      type: 'steps',
      target: 10000,
      duration: 7,
      startDate: new Date() as any,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) as any,
      participants: [user.uid],
      rewards: {
        coins: 100,
        badge: 'Test Badge',
      },
      isActive: true,
      createdBy: user.uid,
    });
    
    if (!result.success) throw new Error(result.error);
    return result;
  };

  const testAddWellnessMetrics = async () => {
    if (!user) throw new Error('User not authenticated');
    
    const result = await firestoreService.wellness.addDailyMetrics({
      uid: user.uid,
      date: new Date().toISOString().split('T')[0],
      steps: Math.floor(Math.random() * 10000) + 5000,
      calories: Math.floor(Math.random() * 1000) + 500,
      activeMinutes: Math.floor(Math.random() * 120) + 30,
      sleepHours: Math.floor(Math.random() * 3) + 7,
      waterIntake: Math.floor(Math.random() * 5) + 6,
      mood: ['excellent', 'good', 'okay', 'poor', 'terrible'][Math.floor(Math.random() * 5)] as any,
      stressLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      energyLevel: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
    });
    
    if (!result.success) throw new Error(result.error);
    return result;
  };

  if (!isAuthenticated) {
    return (
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-wellness-primary" />
            Database Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Please sign in to test database functionality.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Database Test Controls */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-wellness-primary" />
            Database Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => runTest('Create Profile', testCreateProfile)}
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <User className="w-4 h-4 mr-2" />}
              Test Create Profile
            </Button>
            
            <Button
              onClick={() => runTest('Add Activity', testAddActivity)}
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Activity className="w-4 h-4 mr-2" />}
              Test Add Activity
            </Button>
            
            <Button
              onClick={() => runTest('Get Leaderboard', testGetLeaderboard)}
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trophy className="w-4 h-4 mr-2" />}
              Test Leaderboard
            </Button>
            
            <Button
              onClick={() => runTest('Create Challenge', testCreateChallenge)}
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
              Test Create Challenge
            </Button>
            
            <Button
              onClick={() => runTest('Add Wellness Metrics', testAddWellnessMetrics)}
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
              Test Wellness Metrics
            </Button>
          </div>

          {/* Test Results */}
          {Object.keys(testResults).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Test Results:</h4>
              {Object.entries(testResults).map(([testName, result]) => (
                <div key={testName} className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">{testName}:</span>
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "PASS" : "FAIL"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{result.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Data Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Profile */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-wellness-primary" />
              User Profile (Real-time)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading profile...</span>
              </div>
            ) : profileError ? (
              <Alert>
                <XCircle className="h-4 w-4" />
                <AlertDescription>{profileError}</AlertDescription>
              </Alert>
            ) : profile ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <img 
                    src={profile.photoURL || '/placeholder-avatar.jpg'} 
                    alt={profile.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{profile.displayName}</div>
                    <div className="text-sm text-muted-foreground">{profile.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Wellness Score:</span>
                    <div className="font-semibold">{profile.wellnessScore}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Steps:</span>
                    <div className="font-semibold">{profile.totalSteps.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Calories:</span>
                    <div className="font-semibold">{profile.totalCalories.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Workouts:</span>
                    <div className="font-semibold">{profile.totalWorkouts}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">No profile data available</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-wellness-primary" />
              Recent Activities (Real-time)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading activities...</span>
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-2">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div>
                      <div className="font-medium capitalize">{activity.type}</div>
                      <div className="text-sm text-muted-foreground">{activity.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{activity.value.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {activity.timestamp && new Date(activity.timestamp.seconds * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">No activities found</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-wellness-primary" />
            Leaderboard (Real-time)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboardLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading leaderboard...</span>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div key={entry.uid} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-wellness-primary/10 flex items-center justify-center font-semibold text-wellness-primary">
                      {index + 1}
                    </div>
                    <img 
                      src={entry.photoURL || '/placeholder-avatar.jpg'} 
                      alt={entry.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{entry.displayName}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.activities.steps.toLocaleString()} steps
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-wellness-primary">{entry.totalPoints}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No leaderboard data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseTest;
