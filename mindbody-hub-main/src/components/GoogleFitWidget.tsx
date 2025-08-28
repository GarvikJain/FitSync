import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Heart, 
  Bed, 
  Zap, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface HealthData {
  steps: {
    value: number;
    goal: number;
    unit: string;
  };
  calories: {
    value: number;
    goal: number;
    unit: string;
  };
  heartRate: {
    value: number;
    unit: string;
    timestamp: string;
  } | null;
  sleep: {
    value: number;
    goal: number;
    unit: string;
  };
  lastSynced: string;
}

interface GoogleFitWidgetProps {
  className?: string;
}

const GoogleFitWidget = ({ className }: GoogleFitWidgetProps) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('googleFitToken');
    if (token) {
      setIsAuthenticated(true);
      fetchHealthData();
    }
  }, []);

  const handleGoogleAuth = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/google`);
      const data = await response.json();
      
      // Open Google OAuth popup
      const popup = window.open(
        data.authUrl,
        'googleAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for the callback
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          const token = localStorage.getItem('googleFitToken');
          if (token) {
            setIsAuthenticated(true);
            fetchHealthData();
          }
        }
      }, 1000);

    } catch (error) {
      console.error('Auth error:', error);
      setError('Failed to authenticate with Google Fit');
    }
  };

  const fetchHealthData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('googleFitToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/health/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          await refreshToken();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHealthData(data);
      setLastSyncTime(new Date().toLocaleTimeString());
      
    } catch (error) {
      console.error('Fetch health data error:', error);
      setError('Failed to fetch health data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('googleFitToken');
      if (!token) {
        throw new Error('No token to refresh');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      // Retry fetching health data
      await fetchHealthData();
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear token and require re-authentication
      localStorage.removeItem('googleFitToken');
      setIsAuthenticated(false);
      setError('Authentication expired. Please reconnect your Google Fit account.');
    }
  };

  const disconnect = () => {
    localStorage.removeItem('googleFitToken');
    setIsAuthenticated(false);
    setHealthData(null);
    setError(null);
    setLastSyncTime(null);
  };

  const formatSleepTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return "bg-wellness-success";
    if (percentage >= 75) return "bg-wellness-accent";
    if (percentage >= 50) return "bg-wellness-warning";
    return "bg-wellness-primary";
  };

  const getTrendIcon = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return <TrendingUp className="h-4 w-4 text-wellness-success" />;
    if (percentage >= 75) return <TrendingUp className="h-4 w-4 text-wellness-accent" />;
    return <TrendingDown className="h-4 w-4 text-muted-foreground" />;
  };

  // Listen for auth success message from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_FIT_AUTH_SUCCESS') {
        localStorage.setItem('googleFitToken', event.data.token);
        setIsAuthenticated(true);
        fetchHealthData();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [fetchHealthData]);

  if (!isAuthenticated) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-wellness-primary/10 rounded-lg">
              <Activity className="h-5 w-5 text-wellness-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Google Fit Integration</CardTitle>
              <CardDescription>
                Connect your Google Fit account to view health metrics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Connect your Google Fit account to see your daily health metrics including steps, calories, heart rate, and sleep data.
            </p>
            <Button onClick={handleGoogleAuth} className="w-full">
              <Activity className="h-4 w-4 mr-2" />
              Connect Google Fit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-wellness-primary/10 rounded-lg">
              <Activity className="h-5 w-5 text-wellness-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Health Metrics</CardTitle>
              <CardDescription>
                Real-time data from Google Fit
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lastSyncTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last sync: {lastSyncTime}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchHealthData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        {isLoading && !healthData ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-wellness-primary" />
          </div>
        ) : healthData ? (
          <div className="space-y-6">
            {/* Steps */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-wellness-primary" />
                  <span className="font-medium">Daily Steps</span>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(healthData.steps.value, healthData.steps.goal)}
                  <span className="text-sm font-medium">
                    {healthData.steps.value.toLocaleString()} / {healthData.steps.goal.toLocaleString()}
                  </span>
                </div>
              </div>
              <Progress 
                value={(healthData.steps.value / healthData.steps.goal) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round((healthData.steps.value / healthData.steps.goal) * 100)}% of daily goal</span>
                <span>{healthData.steps.unit}</span>
              </div>
            </div>

            {/* Calories */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-wellness-accent" />
                  <span className="font-medium">Calories Burned</span>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(healthData.calories.value, healthData.calories.goal)}
                  <span className="text-sm font-medium">
                    {healthData.calories.value} / {healthData.calories.goal}
                  </span>
                </div>
              </div>
              <Progress 
                value={(healthData.calories.value / healthData.calories.goal) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round((healthData.calories.value / healthData.calories.goal) * 100)}% of daily goal</span>
                <span>{healthData.calories.unit}</span>
              </div>
            </div>

            {/* Heart Rate */}
            {healthData.heartRate && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-destructive" />
                    <span className="font-medium">Heart Rate</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {healthData.heartRate.value} {healthData.heartRate.unit}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last measured: {new Date(healthData.heartRate.timestamp).toLocaleTimeString()}
                </div>
              </div>
            )}

            {/* Sleep */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-wellness-secondary" />
                  <span className="font-medium">Sleep Duration</span>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(healthData.sleep.value, healthData.sleep.goal)}
                  <span className="text-sm font-medium">
                    {formatSleepTime(healthData.sleep.value)} / {formatSleepTime(healthData.sleep.goal)}
                  </span>
                </div>
              </div>
              <Progress 
                value={(healthData.sleep.value / healthData.sleep.goal) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round((healthData.sleep.value / healthData.sleep.goal) * 100)}% of recommended sleep</span>
                <span>Last night</span>
              </div>
            </div>

            {/* Disconnect Button */}
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={disconnect}
                className="w-full"
              >
                Disconnect Google Fit
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No health data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleFitWidget;


