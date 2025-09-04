import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, RefreshCw, AlertCircle, CheckCircle, Server, Globe } from 'lucide-react';

const GoogleFitDebug = () => {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline' | null>(null);
  const [authStatus, setAuthStatus] = useState<'checking' | 'working' | 'error' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  const checkServerStatus = async () => {
    try {
      setServerStatus('checking');
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
        setError(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      setServerStatus('offline');
      setError(`Cannot connect to server: ${error.message}`);
    }
  };

  const testAuthEndpoint = async () => {
    try {
      setAuthStatus('checking');
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/auth/google`);
      if (response.ok) {
        const data = await response.json();
        if (data.authUrl) {
          setAuthStatus('working');
        } else {
          setAuthStatus('error');
          setError('Auth endpoint returned invalid response');
        }
      } else {
        setAuthStatus('error');
        setError(`Auth endpoint error: ${response.status}`);
      }
    } catch (error) {
      setAuthStatus('error');
      setError(`Auth endpoint failed: ${error.message}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Google Fit Debug Panel
        </CardTitle>
        <CardDescription>
          Test and debug Google Fit integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Server Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Backend Server</span>
          </div>
          <div className="flex items-center gap-2">
            {serverStatus === 'checking' && (
              <RefreshCw className="h-4 w-4 animate-spin" />
            )}
            {serverStatus === 'online' && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {serverStatus === 'offline' && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={serverStatus === 'online' ? 'default' : 'secondary'}>
              {serverStatus || 'Not checked'}
            </Badge>
          </div>
        </div>

        {/* Auth Endpoint */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Auth Endpoint</span>
          </div>
          <div className="flex items-center gap-2">
            {authStatus === 'checking' && (
              <RefreshCw className="h-4 w-4 animate-spin" />
            )}
            {authStatus === 'working' && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {authStatus === 'error' && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={authStatus === 'working' ? 'default' : 'secondary'}>
              {authStatus || 'Not tested'}
            </Badge>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={checkServerStatus} variant="outline" size="sm">
            <Server className="h-4 w-4 mr-2" />
            Check Server
          </Button>
          <Button onClick={testAuthEndpoint} variant="outline" size="sm">
            <Globe className="h-4 w-4 mr-2" />
            Test Auth
          </Button>
        </div>

        {/* API URL Display */}
        <div className="text-xs text-muted-foreground">
          API Base URL: {API_BASE_URL}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleFitDebug;
