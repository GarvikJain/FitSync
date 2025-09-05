import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, RefreshCw, Heart, Zap, Moon, TrendingUp, AlertCircle } from 'lucide-react';

const GoogleFitWidget = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('googleFitToken');
    if (token) {
      setIsConnected(true);
      fetchHealthData();
    }
  }, []);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get OAuth URL from backend
      const response = await fetch(`${API_BASE_URL}/auth/google`);
      if (!response.ok) {
        throw new Error('Failed to get OAuth URL');
      }
      
      const { authUrl } = await response.json();
      
      // Open OAuth popup
      const popup = window.open(
        authUrl,
        'googleFitAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );
      
      // Listen for auth completion
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          checkAuthStatus();
        }
      }, 1000);
      
    } catch (error) {
      setError(`Connection failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('googleFitToken');
    if (token) {
      setIsConnected(true);
      fetchHealthData();
    }
    setIsLoading(false);
  };

  const fetchHealthData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('googleFitToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/health/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          await refreshToken();
          return;
        }
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data = await response.json();
      setHealthData(data);
      setLastSynced(new Date());
      
    } catch (error) {
      setError(`Failed to fetch health data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('googleFitToken');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Token refreshed, try fetching data again
        fetchHealthData();
      } else {
        // Refresh failed, user needs to reconnect
        handleDisconnect();
      }
    } catch (error) {
      handleDisconnect();
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('googleFitToken');
    setIsConnected(false);
    setHealthData(null);
    setLastSynced(null);
    setError(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return 'text-green-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTrendIcon = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (percentage >= 75) return <TrendingUp className="w-4 h-4 text-yellow-500" />;
    return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
  };

  if (!isConnected) {
    return (
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-wellness-primary" />
            Google Fit Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 space-y-3">
            <div className="w-16 h-16 mx-auto bg-wellness-primary/10 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-wellness-primary" />
            </div>
            <h3 className="font-semibold">Connect Google Fit</h3>
            <p className="text-sm text-muted-foreground">
              Sync your health data for real-time updates and better insights
            </p>
            <Button 
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-wellness-primary hover:bg-wellness-primary/90 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Now'
              )}
            </Button>
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="wellness-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-wellness-primary" />
            Google Fit Data
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchHealthData}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
        {lastSynced && (
          <p className="text-xs text-muted-foreground">
            Last synced: {formatTime(lastSynced)}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {isLoading && !healthData && (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-wellness-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading health data...</p>
          </div>
        )}

        {healthData && (
          <div className="space-y-4">
            {/* Steps */}
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-wellness-primary/10 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-wellness-primary" />
                </div>
                <div>
                  <p className="font-medium">Steps</p>
                  <p className="text-sm text-muted-foreground">
                    {healthData.steps.value.toLocaleString()} / {healthData.steps.goal.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(healthData.steps.value, healthData.steps.goal)}
                <span className={`font-bold ${getProgressColor(healthData.steps.value, healthData.steps.goal)}`}>
                  {Math.round((healthData.steps.value / healthData.steps.goal) * 100)}%
                </span>
              </div>
            </div>

            {/* Calories */}
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">Calories</p>
                  <p className="text-sm text-muted-foreground">
                    {healthData.calories.value} / {healthData.calories.goal} kcal
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(healthData.calories.value, healthData.calories.goal)}
                <span className={`font-bold ${getProgressColor(healthData.calories.value, healthData.calories.goal)}`}>
                  {Math.round((healthData.calories.value / healthData.calories.goal) * 100)}%
                </span>
              </div>
            </div>

            {/* Heart Rate */}
            {healthData.heartRate && (
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium">Heart Rate</p>
                    <p className="text-sm text-muted-foreground">
                      {healthData.heartRate.value} {healthData.heartRate.unit}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-red-500 border-red-500">
                  Latest
                </Badge>
              </div>
            )}

            {/* Sleep */}
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <Moon className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">Sleep</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(healthData.sleep.value / 60)}h {healthData.sleep.value % 60}m / {Math.round(healthData.sleep.goal / 60)}h
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(healthData.sleep.value, healthData.sleep.goal)}
                <span className={`font-bold ${getProgressColor(healthData.sleep.value, healthData.sleep.goal)}`}>
                  {Math.round((healthData.sleep.value / healthData.sleep.goal) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleFitWidget;
