
import React, { Component, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

class SquareErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('SquareErrorBoundary caught an error:', error, errorInfo);
    
    // Check if this is a Square-related error
    const isSquareError = error.message.includes('deref') || 
                         error.message.includes('Square') ||
                         error.stack?.includes('square') ||
                         error.stack?.includes('@square/web-sdk');
    
    if (isSquareError) {
      console.error('Square Web SDK error detected:', {
        message: error.message,
        stack: error.stack,
        errorInfo
      });
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      const isSquareError = this.state.error?.message.includes('deref') || 
                           this.state.error?.message.includes('Square');

      return (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <div>
                  {isSquareError ? (
                    <div>
                      <strong>Payment form error:</strong> There was an issue initializing the payment form. 
                      This usually resolves by refreshing the page or trying again.
                    </div>
                  ) : (
                    <div>
                      <strong>Something went wrong:</strong> An unexpected error occurred.
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={this.handleRetry}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4 text-xs">
                    <summary className="cursor-pointer text-gray-600">Technical Details</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {this.state.error.message}
                      {this.state.error.stack && (
                        <>
                          {'\n\nStack Trace:\n'}
                          {this.state.error.stack}
                        </>
                      )}
                    </pre>
                  </details>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SquareErrorBoundary;
