
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CreditCard } from 'lucide-react';

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
  return (
    <div className="space-y-4">
      <div className="relative">
        <div 
          id="card-container" 
          ref={cardContainerRef}
          className="p-4 border border-gray-300 rounded-lg min-h-[120px] bg-white"
        />
        
        {/* Loading overlay */}
        {(isInitializing || (!isInitialized && !error)) && (
          <div className="absolute inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-sm text-gray-600">Loading payment form...</span>
            </div>
          </div>
        )}
        
        {/* Success indicator */}
        {isInitialized && !error && (
          <div className="absolute top-2 right-2">
            <CreditCard className="w-5 h-5 text-green-500" />
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="ml-2"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
      )}
      
      {!isInitialized && !isInitializing && !error && (
        <div className="text-amber-600 text-sm bg-amber-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span>Payment form is initializing...</span>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="ml-2"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SquareCardInput;
