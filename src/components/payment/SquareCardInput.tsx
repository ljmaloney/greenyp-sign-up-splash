
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CreditCard, AlertCircle, Clock, CheckCircle2, Loader2 } from 'lucide-react';

interface SquareCardInputProps {
  cardContainerRef: React.RefObject<HTMLDivElement>;
  error: string | null;
  isInitialized?: boolean;
  isInitializing?: boolean;
  initializationPhase?: string;
  retryCount?: number;
  onRetry?: () => void;
}

const SquareCardInput = ({ 
  cardContainerRef, 
  error, 
  isInitialized = false,
  isInitializing = false,
  initializationPhase = 'idle',
  retryCount = 0,
  onRetry 
}: SquareCardInputProps) => {
  const showLoadingState = isInitializing || (!isInitialized && !error);
  const showReadyState = isInitialized && !error && !isInitializing;
  const showErrorState = !!error;

  const getPhaseMessage = (phase: string): { text: string; icon: React.ReactNode } => {
    switch (phase) {
      case 'validating-config':
        return { text: 'Validating configuration...', icon: <Loader2 className="w-4 h-4 animate-spin" /> };
      case 'loading-sdk':
        return { text: 'Loading secure payment system...', icon: <Loader2 className="w-4 h-4 animate-spin" /> };
      case 'creating-payments':
        return { text: 'Connecting to payment gateway...', icon: <Loader2 className="w-4 h-4 animate-spin" /> };
      case 'detecting-container':
        return { text: 'Preparing form container...', icon: <Clock className="w-4 h-4" /> };
      case 'creating-card':
        return { text: 'Setting up card fields...', icon: <CreditCard className="w-4 h-4" /> };
      case 'attaching-card':
        return { text: 'Finalizing payment form...', icon: <RefreshCw className="w-4 h-4 animate-spin" /> };
      case 'ready':
        return { text: 'Payment form ready', icon: <CheckCircle2 className="w-4 h-4 text-green-600" /> };
      case 'error':
      case 'failed':
        return { text: 'Initialization failed', icon: <AlertCircle className="w-4 h-4 text-red-600" /> };
      default:
        return { text: 'Starting payment form...', icon: <RefreshCw className="w-4 h-4 animate-spin" /> };
    }
  };

  const phaseInfo = getPhaseMessage(initializationPhase);

  const isStyleError = error?.includes('InvalidStylesError') || error?.includes('style');
  const isContainerError = error?.includes('container') || error?.includes('Container');
  const isTimeoutError = error?.includes('timeout') || error?.includes('Timeout');

  const getErrorSuggestion = () => {
    if (isStyleError) return 'Styling conflict detected. Retrying with simplified styling...';
    if (isContainerError) return 'Container detection issue. The dialog may need more time to render.';
    if (isTimeoutError) return 'Connection timeout. Please check your internet connection.';
    return 'An unexpected error occurred.';
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div 
          id="card-container" 
          ref={cardContainerRef}
          className="p-4 border border-gray-300 rounded-lg min-h-[120px] bg-white"
          style={{ minHeight: '120px' }}
        />
        
        {/* Loading overlay with detailed phase information */}
        {showLoadingState && (
          <div className="absolute inset-0 bg-gray-50 bg-opacity-95 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center space-y-3 max-w-xs text-center">
              {phaseInfo.icon}
              <div>
                <div className="text-sm font-medium text-gray-700">{phaseInfo.text}</div>
                {retryCount > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Attempt {retryCount} • Enhanced stability mode
                  </div>
                )}
                {initializationPhase === 'detecting-container' && (
                  <div className="text-xs text-gray-500 mt-1">
                    Ensuring dialog is fully stable...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Success indicator */}
        {showReadyState && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Ready</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced error state with specific suggestions */}
      {showErrorState && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium">Payment Form Error</div>
              <div className="mt-1">{getErrorSuggestion()}</div>
              {retryCount > 0 && (
                <div className="text-xs text-red-500 mt-2">
                  Failed after {retryCount} attempt{retryCount > 1 ? 's' : ''}
                  {retryCount >= 3 ? ' • Consider closing and reopening the dialog' : ''}
                </div>
              )}
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer">Technical Details</summary>
                  <div className="text-xs mt-1 font-mono">{error}</div>
                </details>
              )}
            </div>
            {onRetry && retryCount < 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="ml-2 flex-shrink-0"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Help text when ready */}
      {showReadyState && (
        <div className="text-xs text-gray-500 bg-green-50 border border-green-200 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Payment form is ready. Enter your card information above.</span>
          </div>
        </div>
      )}

      {/* Progressive retry feedback */}
      {showLoadingState && retryCount > 1 && (
        <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Using enhanced initialization mode for better stability...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SquareCardInput;
