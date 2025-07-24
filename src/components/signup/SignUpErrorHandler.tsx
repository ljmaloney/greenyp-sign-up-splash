
import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

interface SignUpErrorHandlerProps {
  error: string;
  isSystemError: boolean;
  isDuplicateEmail?: boolean;
  onRetry?: () => void;
  onEmailChange?: () => void;
}

const SignUpErrorHandler = ({ 
  error, 
  isSystemError, 
  isDuplicateEmail = false,
  onRetry,
  onEmailChange 
}: SignUpErrorHandlerProps) => {
  const navigate = useNavigate();

  // Handle duplicate email specifically
  if (isDuplicateEmail) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-3">
          <div>
            <p className="font-medium">Account Already Exists</p>
            <p className="text-sm mt-1">
              An account with this email address already exists. You can:
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/subscribers/login')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-3 w-3" />
              Sign In Instead
            </Button>
            {onEmailChange && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onEmailChange}
                className="flex items-center gap-2"
              >
                Use Different Email
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Handle system errors
  if (isSystemError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-3">
          <div>
            <p className="font-medium">System Temporarily Unavailable</p>
            <p className="text-sm mt-1">
              Our servers are experiencing issues. Please try again in a few minutes.
            </p>
          </div>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRetry}
              className="flex items-center gap-2 w-fit"
            >
              <RefreshCw className="h-3 w-3" />
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Handle other errors
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-3">
        <div>
          <p className="font-medium">Registration Failed</p>
          <p className="text-sm mt-1 break-words">{error}</p>
        </div>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRetry}
            className="flex items-center gap-2 w-fit"
          >
            <RefreshCw className="h-3 w-3" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default SignUpErrorHandler;
