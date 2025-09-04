import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (token) {
      // Store the token
      localStorage.setItem('googleFitToken', token);
      
      // Send message to parent window if this is a popup
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_FIT_AUTH_SUCCESS',
          token: token
        }, window.location.origin);
        window.close();
      } else {
        // Redirect to main page
        navigate('/', { replace: true });
      }
    } else if (error) {
      // Handle error
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_FIT_AUTH_ERROR',
          error: error
        }, window.location.origin);
        window.close();
      } else {
        navigate('/auth-error', { replace: true });
      }
    } else {
      // No token or error, redirect to main page
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  const token = searchParams.get('token');
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          {token ? (
            <>
              <CheckCircle className="h-12 w-12 text-wellness-success mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Authentication Successful!</h2>
              <p className="text-muted-foreground">
                Your Google Fit account has been connected successfully.
              </p>
            </>
          ) : error ? (
            <>
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Authentication Failed</h2>
              <p className="text-muted-foreground">
                There was an error connecting your Google Fit account.
              </p>
            </>
          ) : (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-wellness-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Processing...</h2>
              <p className="text-muted-foreground">
                Please wait while we complete the authentication process.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;


