
import { useEffect, useRef, useState, useCallback } from 'react';

interface SquarePaymentState {
  cardContainerRef: React.RefObject<HTMLDivElement>;
  payments: any;
  card: any;
  error: string | null;
  isInitialized: boolean;
  isInitializing: boolean;
  retryCount: number;
}

export const useImprovedSquarePayment = () => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<SquarePaymentState>({
    cardContainerRef,
    payments: null,
    card: null,
    error: null,
    isInitialized: false,
    isInitializing: false,
    retryCount: 0
  });
  
  // Refs to track Square instances for cleanup
  const paymentsInstanceRef = useRef<any>(null);
  const cardInstanceRef = useRef<any>(null);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attachRetryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const setError = useCallback((error: string | null) => {
    if (!isMountedRef.current) return;
    setState(prev => ({ ...prev, error }));
  }, []);

  // Cleanup function to properly destroy Square instances
  const cleanupSquareInstances = useCallback(() => {
    console.log('🧹 Cleaning up Square instances...');
    
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
        console.log('🗑️ Destroying Square card instance...');
        if (typeof cardInstanceRef.current.destroy === 'function') {
          cardInstanceRef.current.destroy();
        }
      } catch (err) {
        console.warn('⚠️ Error destroying Square card instance:', err);
      }
      cardInstanceRef.current = null;
    }

    // Clear payment instance reference
    paymentsInstanceRef.current = null;

    // Reset state
    if (isMountedRef.current) {
      setState(prev => ({
        ...prev,
        card: null,
        payments: null,
        isInitialized: false,
        isInitializing: false
      }));
    }
  }, []);

  const attachCard = useCallback(async (paymentsInstance: any, retryCount = 0) => {
    const maxRetries = 3;
    const retryDelay = 300;

    if (!isMountedRef.current) return;

    // Check if component is still mounted and DOM element exists
    const cardContainer = document.getElementById('card-container');
    if (!cardContainer && retryCount < maxRetries) {
      console.log(`🔄 Card container not found, retrying... (${retryCount + 1}/${maxRetries})`);
      
      attachRetryTimeoutRef.current = setTimeout(() => {
        if (paymentsInstanceRef.current === paymentsInstance && isMountedRef.current) {
          attachCard(paymentsInstance, retryCount + 1);
        }
      }, retryDelay);
      return;
    }

    if (!cardContainer) {
      throw new Error('Card container element not found after maximum retries');
    }

    if (!cardContainer.isConnected) {
      throw new Error('Card container element is not connected to the DOM');
    }

    try {
      console.log('🎯 Creating and attaching Square card...');
      
      // Cleanup any existing card instance before creating a new one
      if (cardInstanceRef.current) {
        try {
          if (typeof cardInstanceRef.current.destroy === 'function') {
            cardInstanceRef.current.destroy();
          }
        } catch (err) {
          console.warn('⚠️ Error destroying previous card instance:', err);
        }
        cardInstanceRef.current = null;
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
      
      // Store reference before attaching
      cardInstanceRef.current = cardInstance;
      
      await cardInstance.attach('#card-container');
      
      // Only update state if the component is still mounted and this is the current instance
      if (paymentsInstanceRef.current === paymentsInstance && isMountedRef.current) {
        setState(prev => ({
          ...prev,
          card: cardInstance,
          isInitialized: true,
          isInitializing: false,
          error: null
        }));
        console.log('✅ Square payment card attached successfully');
      }
    } catch (err) {
      console.error('❌ Failed to attach Square card:', err);
      
      // Clean up on error
      if (cardInstanceRef.current) {
        try {
          if (typeof cardInstanceRef.current.destroy === 'function') {
            cardInstanceRef.current.destroy();
          }
        } catch (cleanupErr) {
          console.warn('⚠️ Error during cleanup after attach failure:', cleanupErr);
        }
        cardInstanceRef.current = null;
      }
      
      throw err;
    }
  }, []);

  const initializeSquare = useCallback(async () => {
    if (state.isInitialized || state.isInitializing) {
      console.log('🔄 Square already initialized or initializing, skipping...');
      return;
    }

    setState(prev => ({ ...prev, isInitializing: true, error: null }));

    try {
      // Use environment variables for Square configuration
      const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
      const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
      
      if (!appId || !locationId) {
        throw new Error('Square application ID or location ID not configured');
      }

      console.log('🚀 Initializing Square Web SDK...');
      
      // Dynamically import Square Web SDK
      const { payments: paymentsFunction } = await import('@square/web-sdk');
      
      // Initialize Square Payments
      const paymentsInstance = await paymentsFunction(appId, locationId);
      
      // Store reference for cleanup
      paymentsInstanceRef.current = paymentsInstance;
      
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, payments: paymentsInstance }));
      }
      
      console.log('✅ Square payments instance created, waiting for DOM...');
      
      // Wait for DOM to be ready with a longer delay to ensure stability
      initializationTimeoutRef.current = setTimeout(async () => {
        try {
          if (paymentsInstanceRef.current === paymentsInstance && isMountedRef.current) {
            await attachCard(paymentsInstance);
          }
        } catch (err) {
          console.error('❌ Failed to initialize Square card:', err);
          if (isMountedRef.current) {
            setState(prev => ({
              ...prev,
              error: 'Failed to initialize payment form',
              isInitializing: false,
              retryCount: prev.retryCount + 1
            }));
          }
        }
      }, 400);
      
    } catch (err) {
      console.error('❌ Failed to initialize Square payments:', err);
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          error: 'Failed to initialize payment form',
          isInitializing: false,
          retryCount: prev.retryCount + 1
        }));
      }
    }
  }, [state.isInitialized, state.isInitializing, attachCard]);

  const retryInitialization = useCallback(() => {
    console.log('🔄 Retrying Square initialization...');
    cleanupSquareInstances();
    setTimeout(() => {
      if (isMountedRef.current) {
        initializeSquare();
      }
    }, 500);
  }, [cleanupSquareInstances, initializeSquare]);

  useEffect(() => {
    isMountedRef.current = true;
    initializeSquare();

    return () => {
      console.log('🧹 useImprovedSquarePayment cleanup triggered');
      isMountedRef.current = false;
      cleanupSquareInstances();
    };
  }, [initializeSquare, cleanupSquareInstances]);

  return {
    ...state,
    setError,
    cleanup: cleanupSquareInstances,
    retryInitialization
  };
};
