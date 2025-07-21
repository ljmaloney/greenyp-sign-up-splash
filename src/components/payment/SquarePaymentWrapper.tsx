
import React, { useEffect, useRef, useState } from 'react';
import SquareErrorBoundary from './SquareErrorBoundary';

interface SquarePaymentWrapperProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

const SquarePaymentWrapper = ({ children, onRetry }: SquarePaymentWrapperProps) => {
  const [retryKey, setRetryKey] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      
      // Additional cleanup for Square elements
      const cardContainer = document.getElementById('card-container');
      if (cardContainer) {
        // Clear any Square-related event listeners or observers
        cardContainer.innerHTML = '';
      }
    };
  }, [retryKey]);

  const handleRetry = () => {
    console.log('SquarePaymentWrapper: Retrying Square payment initialization...');
    
    // Force a re-render by changing the key
    setRetryKey(prev => prev + 1);
    
    // Call parent retry handler if provided
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <SquareErrorBoundary onRetry={handleRetry}>
      <div key={retryKey}>
        {children}
      </div>
    </SquareErrorBoundary>
  );
};

export default SquarePaymentWrapper;
