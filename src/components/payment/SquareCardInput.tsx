
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CreditCard, AlertCircle, Clock } from 'lucide-react';

interface SquareCardInputProps {
  cardContainerRef: React.RefObject<HTMLDivElement>;
  error: string | null;
  isInitialized?: boolean;
  isInitializing?: boolean;
  onRetry?: () => void;
}

const SquareCardInput = ({ 
  cardContainerRef, 
  error, 
  isInitialized = false,
  isInitializing = false,
  onRetry 
}: SquareCardInputProps) => {
  const showLoadingState = isInitializing || (!isInitialized && !error);
  const showReadyState = isInitialized && !error && !isInitializing;
  const showErrorState = !!error;
  const showPendingState = !isInitialized && !isInitializing && !error;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div 
          id="card-container" 
          ref={cardContainerRef}
          className="p-4 border border-gray-300 rounded-lg min-h-[120px] bg-white"
          style={{ minHeight: '120px' }}
        />
        
        {/* Loading overlay */}
        {showLoadingState && (
          <div className="absolute inset-0 bg-gray-50 bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700">Loading payment form...</div>
                <div className="text-xs text-gray-500 mt-1">This may take a few moments</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Success indicator */}
        {showReadyState && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center space-x-1 text-green-600">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-medium">Ready</span>
            </div>
          </div>
        )}

        {/* Pending state overlay */}
        {showPendingState && (
          <div className="absolute inset-0 bg-amber-50 bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center space-y-3">
              <Clock className="w-6 h-6 text-amber-500" />
              <div className="text-center">
                <div className="text-sm font-medium text-amber-700">Payment form pending...</div>
                <div className="text-xs text-amber-600 mt-1">Click retry if this persists</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Error state */}
      {showErrorState && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium">Payment Form Error</div>
              <div className="mt-1">{error}</div>
            </div>
            {onRetry && (
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
      
      {/* Pending state message */}
      {showPendingState && (
        <div className="text-amber-700 text-sm bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Payment form is starting up...</span>
            </div>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="ml-2"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Try Now
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Help text when ready */}
      {showReadyState && (
        <div className="text-xs text-gray-500">
          Enter your payment information in the fields above. All data is securely processed by Square.
        </div>
      )}
    </div>
  );
};

export default SquareCardInput;
