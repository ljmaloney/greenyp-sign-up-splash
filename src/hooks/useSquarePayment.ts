
import { useEffect, useRef, useState, useCallback } from 'react';

export const useSquarePayment = () => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Refs to track Square instances for cleanup
  const paymentsInstanceRef = useRef<any>(null);
  const cardInstanceRef = useRef<any>(null);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attachRetryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function to properly destroy Square instances
  const cleanupSquareInstances = useCallback(() => {
    console.log('Cleaning up Square instances...');
    
    // Clear any pending timeouts
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
      initializationTimeoutRef.current = null;
    }
    
    if (attachRetryTimeoutRef.current) {
      clearTimeout(attachRetryTimeoutRef.current);
      attachRetryTimeoutRef.current = null;
    }

    // Destroy card instance if it exists
    if (cardInstanceRef.current) {
      try {
        console.log('Destroying Square card instance...');
        if (typeof cardInstanceRef.current.destroy === 'function') {
          cardInstanceRef.current.destroy();
        }
      } catch (err) {
        console.warn('Error destroying Square card instance:', err);
      }
      cardInstanceRef.current = null;
    }

    // Clear payment instance reference
    if (paymentsInstanceRef.current) {
      try {
        console.log('Clearing Square payments instance...');
        // Note: Square payments instance doesn't have a destroy method,
        // but we clear our reference to help with garbage collection
        paymentsInstanceRef.current = null;
      } catch (err) {
        console.warn('Error clearing Square payments instance:', err);
      }
    }

    // Reset state
    setCard(null);
    setPayments(null);
    setIsInitialized(false);
  }, []);

  const attachCard = useCallback(async (paymentsInstance: any, retryCount = 0) => {
    const maxRetries = 3; // Reduced retries to prevent excessive attempts
    const retryDelay = 200; // Slightly increased delay

    // Check if component is still mounted and DOM element exists
    const cardContainer = document.getElementById('card-container');
    if (!cardContainer && retryCount < maxRetries) {
      console.log(`Card container not found, retrying... (${retryCount + 1}/${maxRetries})`);
      
      attachRetryTimeoutRef.current = setTimeout(() => {
        // Double-check that we should still be retrying
        if (paymentsInstanceRef.current === paymentsInstance) {
          attachCard(paymentsInstance, retryCount + 1);
        }
      }, retryDelay);
      return;
    }

    if (!cardContainer) {
      throw new Error('Card container element not found after maximum retries');
    }

    // Verify the container is properly attached to the DOM
    if (!cardContainer.isConnected) {
      throw new Error('Card container element is not connected to the DOM');
    }

    try {
      console.log('Creating and attaching Square card...');
      
      // Cleanup any existing card instance before creating a new one
      if (cardInstanceRef.current) {
        try {
          if (typeof cardInstanceRef.current.destroy === 'function') {
            cardInstanceRef.current.destroy();
          }
        } catch (err) {
          console.warn('Error destroying previous card instance:', err);
        }
        cardInstanceRef.current = null;
      }

      const cardInstance = await paymentsInstance.card({
        // Add configuration to help prevent WeakRef issues
        style: {
          '.input-container': {
            borderColor: '#E2E8F0',
            borderRadius: '6px'
          },
          '.input-container.is-focus': {
            borderColor: '#3B82F6'
          },
          '.input-container.is-error': {
            borderColor: '#EF4444'
          }
        }
      });
      
      // Store reference before attaching
      cardInstanceRef.current = cardInstance;
      
      await cardInstance.attach('#card-container');
      
      // Only update state if the component is still mounted and this is the current instance
      if (paymentsInstanceRef.current === paymentsInstance) {
        setCard(cardInstance);
        console.log('Square payment card attached successfully');
      }
    } catch (err) {
      console.error('Failed to attach Square card:', err);
      
      // Clean up on error
      if (cardInstanceRef.current) {
        try {
          if (typeof cardInstanceRef.current.destroy === 'function') {
            cardInstanceRef.current.destroy();
          }
        } catch (cleanupErr) {
          console.warn('Error during cleanup after attach failure:', cleanupErr);
        }
        cardInstanceRef.current = null;
      }
      
      throw err;
    }
  }, []);

  useEffect(() => {
    const initializeSquare = async () => {
      if (isInitialized) return;

      try {
        // Use environment variables for Square configuration
        const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
        const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
        
        if (!appId || !locationId) {
          throw new Error('Square application ID or location ID not configured');
        }

        console.log('Initializing Square Web SDK...');
        
        // Dynamically import Square Web SDK
        const { payments: paymentsFunction } = await import('@square/web-sdk');
        
        // Initialize Square Payments
        const paymentsInstance = await paymentsFunction(appId, locationId);
        
        // Store reference for cleanup
        paymentsInstanceRef.current = paymentsInstance;
        setPayments(paymentsInstance);
        
        console.log('Square payments instance created, waiting for DOM...');
        
        // Wait for DOM to be ready with a longer delay to ensure stability
        initializationTimeoutRef.current = setTimeout(async () => {
          try {
            // Double-check that this is still the current instance
            if (paymentsInstanceRef.current === paymentsInstance) {
              await attachCard(paymentsInstance);
              setIsInitialized(true);
            }
          } catch (err) {
            console.error('Failed to initialize Square card:', err);
            setError('Failed to initialize payment form');
            
            // Clean up on initialization failure
            cleanupSquareInstances();
          }
        }, 300); // Increased delay for better stability
        
      } catch (err) {
        console.error('Failed to initialize Square payments:', err);
        setError('Failed to initialize payment form');
        cleanupSquareInstances();
      }
    };

    initializeSquare();

    // Cleanup function to run when component unmounts or dependencies change
    return () => {
      console.log('useSquarePayment cleanup triggered');
      cleanupSquareInstances();
    };
  }, [attachCard, cleanupSquareInstances, isInitialized]);

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('useSquarePayment final cleanup on unmount');
      cleanupSquareInstances();
    };
  }, [cleanupSquareInstances]);

  return {
    cardContainerRef,
    payments,
    card,
    error,
    setError,
    cleanup: cleanupSquareInstances // Expose cleanup function for manual cleanup if needed
  };
};
