
import { useEffect, useRef, useState, useCallback } from 'react';

export const useStableSquarePayment = () => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Refs to track Square instances for cleanup
  const paymentsInstanceRef = useRef<any>(null);
  const cardInstanceRef = useRef<any>(null);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function to properly destroy Square instances
  const cleanupSquareInstances = useCallback(() => {
    console.log('Cleaning up Square instances...');
    
    // Clear any pending timeouts
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
      initializationTimeoutRef.current = null;
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
    paymentsInstanceRef.current = null;

    // Reset state
    setCard(null);
    setPayments(null);
    setIsInitialized(false);
    setIsInitializing(false);
  }, []);

  const initializeSquare = useCallback(async () => {
    if (isInitialized || isInitializing) return;

    setIsInitializing(true);
    setError(null);

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
      
      console.log('Square payments instance created, creating card...');
      
      // Wait for DOM to be ready
      initializationTimeoutRef.current = setTimeout(async () => {
        try {
          const cardContainer = document.getElementById('card-container');
          if (!cardContainer) {
            throw new Error('Card container element not found');
          }

          const cardInstance = await paymentsInstance.card({
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
          
          cardInstanceRef.current = cardInstance;
          await cardInstance.attach('#card-container');
          
          setCard(cardInstance);
          setIsInitialized(true);
          console.log('Square payment card attached successfully');
        } catch (err) {
          console.error('Failed to initialize Square card:', err);
          setError('Failed to initialize payment form');
          cleanupSquareInstances();
        } finally {
          setIsInitializing(false);
        }
      }, 100);
      
    } catch (err) {
      console.error('Failed to initialize Square payments:', err);
      setError('Failed to initialize payment form');
      setIsInitializing(false);
    }
  }, [isInitialized, isInitializing, cleanupSquareInstances]);

  const retryInitialization = useCallback(() => {
    setRetryCount(prev => prev + 1);
    cleanupSquareInstances();
    initializeSquare();
  }, [cleanupSquareInstances, initializeSquare]);

  useEffect(() => {
    initializeSquare();

    return () => {
      cleanupSquareInstances();
    };
  }, [initializeSquare, cleanupSquareInstances]);

  return {
    cardContainerRef,
    payments,
    card,
    error,
    setError,
    isInitialized,
    isInitializing,
    retryCount,
    retryInitialization
  };
};
