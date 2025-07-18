
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
  
  const paymentsInstanceRef = useRef<any>(null);
  const cardInstanceRef = useRef<any>(null);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attachRetryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const maxRetries = 3;

  const setError = useCallback((error: string | null) => {
    if (!isMountedRef.current) return;
    console.log('🔧 Square payment error updated:', error);
    setState(prev => ({ ...prev, error }));
  }, []);

  const cleanupSquareInstances = useCallback(() => {
    console.log('🧹 Cleaning up Square instances...');
    
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
      initializationTimeoutRef.current = null;
    }
    
    if (attachRetryTimeoutRef.current) {
      clearTimeout(attachRetryTimeoutRef.current);
      attachRetryTimeoutRef.current = null;
    }

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

    paymentsInstanceRef.current = null;

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

  const waitForCardContainer = useCallback(async (maxWaitTime = 5000): Promise<HTMLElement> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkContainer = () => {
        const cardContainer = document.getElementById('card-container');
        
        if (cardContainer && cardContainer.isConnected) {
          console.log('✅ Card container found and connected');
          resolve(cardContainer);
          return;
        }
        
        if (Date.now() - startTime > maxWaitTime) {
          reject(new Error('Card container not found within timeout period'));
          return;
        }
        
        setTimeout(checkContainer, 100);
      };
      
      checkContainer();
    });
  }, []);

  const attachCard = useCallback(async (paymentsInstance: any) => {
    if (!isMountedRef.current) return;

    try {
      console.log('🎯 Starting card attachment process...');
      
      // Wait for card container to be available
      const cardContainer = await waitForCardContainer();
      
      // Cleanup any existing card instance
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

      console.log('🔧 Creating Square card instance...');
      const cardInstance = await paymentsInstance.card({
        style: {
          '.input-container': {
            borderColor: '#E2E8F0',
            borderRadius: '6px',
            padding: '12px'
          },
          '.input-container.is-focus': {
            borderColor: '#3B82F6'
          },
          '.input-container.is-error': {
            borderColor: '#EF4444'
          },
          '.message-text': {
            color: '#EF4444'
          }
        }
      });
      
      cardInstanceRef.current = cardInstance;
      
      console.log('🔗 Attaching card to container...');
      await cardInstance.attach('#card-container');
      
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
      
      throw new Error(`Card attachment failed: ${err.message}`);
    }
  }, [waitForCardContainer]);

  const initializeSquare = useCallback(async () => {
    if (state.isInitialized || state.isInitializing) {
      console.log('🔄 Square already initialized or initializing, skipping...');
      return;
    }

    if (state.retryCount >= maxRetries) {
      console.error('❌ Maximum retry attempts reached for Square initialization');
      setError(`Failed to initialize payment form after ${maxRetries} attempts`);
      return;
    }

    console.log(`🚀 Initializing Square Web SDK (attempt ${state.retryCount + 1}/${maxRetries})...`);
    setState(prev => ({ ...prev, isInitializing: true, error: null }));

    try {
      const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
      const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
      
      if (!appId || !locationId) {
        throw new Error('Square configuration missing: APPLICATION_ID or LOCATION_ID not found in environment variables');
      }

      console.log('📦 Loading Square Web SDK...');
      const { payments: paymentsFunction } = await import('@square/web-sdk');
      
      console.log('🔧 Creating Square payments instance...');
      const paymentsInstance = await paymentsFunction(appId, locationId);
      
      paymentsInstanceRef.current = paymentsInstance;
      
      if (isMountedRef.current) {
        setState(prev => ({ ...prev, payments: paymentsInstance }));
      }
      
      console.log('✅ Square payments instance created successfully');
      
      // Add a delay to ensure DOM is ready
      initializationTimeoutRef.current = setTimeout(async () => {
        try {
          if (paymentsInstanceRef.current === paymentsInstance && isMountedRef.current) {
            await attachCard(paymentsInstance);
          }
        } catch (err) {
          console.error('❌ Failed to attach card during initialization:', err);
          if (isMountedRef.current) {
            setState(prev => ({
              ...prev,
              error: `Payment form initialization failed: ${err.message}`,
              isInitializing: false,
              retryCount: prev.retryCount + 1
            }));
          }
        }
      }, 500);
      
    } catch (err) {
      console.error('❌ Failed to initialize Square payments:', err);
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          error: `Failed to initialize payment form: ${err.message}`,
          isInitializing: false,
          retryCount: prev.retryCount + 1
        }));
      }
    }
  }, [state.isInitialized, state.isInitializing, state.retryCount, attachCard, setError]);

  const retryInitialization = useCallback(() => {
    console.log('🔄 Retrying Square initialization...');
    cleanupSquareInstances();
    setTimeout(() => {
      if (isMountedRef.current) {
        initializeSquare();
      }
    }, 1000);
  }, [cleanupSquareInstances, initializeSquare]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Add a small delay to ensure the component is fully mounted
    const initDelay = setTimeout(() => {
      if (isMountedRef.current) {
        initializeSquare();
      }
    }, 100);

    return () => {
      console.log('🧹 useImprovedSquarePayment cleanup triggered');
      clearTimeout(initDelay);
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
