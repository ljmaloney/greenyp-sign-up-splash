
import { useEffect, useRef, useState, useCallback } from 'react';
import { validateSquareConfiguration } from '@/utils/paymentValidation';

interface DialogSquarePaymentHookResult {
  cardContainerRef: React.RefObject<HTMLDivElement>;
  payments: any;
  card: any;
  error: string | null;
  isInitialized: boolean;
  isInitializing: boolean;
  retryCount: number;
  setError: (error: string | null) => void;
  cleanup: () => void;
  retryInitialization: () => void;
  reset: () => void;
}

export const useDialogSquarePayment = (isDialogOpen: boolean): DialogSquarePaymentHookResult => {
  console.log('🔄 useDialogSquarePayment hook called, dialog open:', isDialogOpen);
  
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Refs for cleanup and state management
  const paymentsInstanceRef = useRef<any>(null);
  const cardInstanceRef = useRef<any>(null);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const initializationAttemptRef = useRef(0);

  const maxRetries = 3;

  const cleanup = useCallback(() => {
    console.log('🧹 Dialog Square cleanup');
    
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
      initializationTimeoutRef.current = null;
    }

    if (cardInstanceRef.current) {
      try {
        if (typeof cardInstanceRef.current.destroy === 'function') {
          cardInstanceRef.current.destroy();
        }
      } catch (err) {
        console.warn('⚠️ Error destroying card instance:', err);
      }
      cardInstanceRef.current = null;
    }

    paymentsInstanceRef.current = null;

    if (isMountedRef.current) {
      setCard(null);
      setPayments(null);
      setIsInitialized(false);
      setIsInitializing(false);
    }
  }, []);

  const reset = useCallback(() => {
    console.log('🔄 Resetting Dialog Square payment state');
    cleanup();
    setError(null);
    setRetryCount(0);
    initializationAttemptRef.current = 0;
  }, [cleanup]);

  const waitForContainer = useCallback(async (): Promise<HTMLElement> => {
    return new Promise((resolve, reject) => {
      const maxWait = 8000; // Increased timeout for dialog scenarios
      const startTime = Date.now();
      
      const check = () => {
        if (!isMountedRef.current) {
          reject(new Error('Component unmounted'));
          return;
        }

        const container = document.getElementById('card-container');
        
        if (container && container.isConnected && container.offsetParent !== null) {
          console.log('✅ Card container ready:', {
            connected: container.isConnected,
            visible: container.offsetParent !== null,
            dimensions: { width: container.offsetWidth, height: container.offsetHeight }
          });
          resolve(container);
          return;
        }
        
        if (Date.now() - startTime > maxWait) {
          reject(new Error('Card container not ready - timeout after 8s'));
          return;
        }
        
        setTimeout(check, 200); // Check every 200ms
      };
      
      // Initial delay to let the dialog render
      setTimeout(check, 300);
    });
  }, []);

  const attachCard = useCallback(async (paymentsInstance: any) => {
    if (!isMountedRef.current) return;

    try {
      console.log('🎯 Attaching card to dialog...');
      
      await waitForContainer();
      
      if (cardInstanceRef.current) {
        try {
          if (typeof cardInstanceRef.current.destroy === 'function') {
            cardInstanceRef.current.destroy();
          }
        } catch (err) {
          console.warn('⚠️ Error destroying previous card:', err);
        }
        cardInstanceRef.current = null;
      }

      const cardInstance = await paymentsInstance.card({
        style: {
          '.input-container': {
            borderColor: '#E2E8F0',
            borderRadius: '6px',
            fontSize: '16px'
          },
          '.input-container.is-focus': {
            borderColor: '#3B82F6'
          },
          '.input-container.is-error': {
            borderColor: '#EF4444'
          },
          '.message-text': {
            fontSize: '14px'
          }
        }
      });
      
      cardInstanceRef.current = cardInstance;
      await cardInstance.attach('#card-container');
      
      if (paymentsInstanceRef.current === paymentsInstance && isMountedRef.current) {
        setCard(cardInstance);
        setIsInitialized(true);
        setIsInitializing(false);
        setError(null);
        console.log('✅ Card attached successfully to dialog');
      }
    } catch (err) {
      console.error('❌ Card attachment failed in dialog:', err);
      throw err;
    }
  }, [waitForContainer]);

  const initializeSquare = useCallback(async () => {
    if (!isDialogOpen) {
      console.log('🚫 Dialog not open, skipping Square initialization');
      return;
    }

    if (isInitializing || isInitialized) {
      console.log('🔄 Square already initializing/initialized, skipping');
      return;
    }

    if (retryCount >= maxRetries) {
      console.error('❌ Max retries reached for dialog Square');
      setError(`Failed after ${maxRetries} attempts`);
      return;
    }

    const currentAttempt = ++initializationAttemptRef.current;
    console.log(`🚀 Initializing Dialog Square (attempt ${currentAttempt})`);
    
    const configError = validateSquareConfiguration();
    if (configError) {
      setError(configError);
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
      const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

      const { payments: paymentsFunction } = await import('@square/web-sdk');
      const paymentsInstance = await paymentsFunction(appId, locationId);
      
      paymentsInstanceRef.current = paymentsInstance;
      
      if (isMountedRef.current && initializationAttemptRef.current === currentAttempt) {
        setPayments(paymentsInstance);
        console.log('✅ Dialog payments instance created');
        
        // Wait a bit longer for dialog to fully render
        initializationTimeoutRef.current = setTimeout(async () => {
          try {
            if (paymentsInstanceRef.current === paymentsInstance && 
                isMountedRef.current && 
                initializationAttemptRef.current === currentAttempt) {
              await attachCard(paymentsInstance);
            }
          } catch (err) {
            console.error('❌ Dialog attachment failed:', err);
            if (isMountedRef.current && initializationAttemptRef.current === currentAttempt) {
              setError(`Initialization failed: ${err.message}`);
              setIsInitializing(false);
              setRetryCount(prev => prev + 1);
            }
          }
        }, 800); // Increased delay for dialog scenarios
      }
      
    } catch (err) {
      console.error('❌ Dialog Square initialization failed:', err);
      if (isMountedRef.current && initializationAttemptRef.current === currentAttempt) {
        setError(`Failed to initialize: ${err.message}`);
        setIsInitializing(false);
        setRetryCount(prev => prev + 1);
      }
    }
  }, [isDialogOpen, isInitializing, isInitialized, retryCount, attachCard]);

  const retryInitialization = useCallback(() => {
    console.log('🔄 Retrying Dialog Square initialization');
    cleanup();
    setError(null);
    setTimeout(() => {
      if (isMountedRef.current && isDialogOpen) {
        initializeSquare();
      }
    }, 1000);
  }, [cleanup, initializeSquare, isDialogOpen]);

  // Effect to handle dialog open/close and initialization
  useEffect(() => {
    isMountedRef.current = true;
    
    if (isDialogOpen) {
      console.log('🎬 Dialog opened, starting Square initialization');
      const initDelay = setTimeout(() => {
        if (isMountedRef.current && isDialogOpen) {
          initializeSquare();
        }
      }, 200);

      return () => {
        clearTimeout(initDelay);
      };
    } else {
      console.log('🚪 Dialog closed, cleaning up Square');
      reset();
    }
  }, [isDialogOpen, initializeSquare, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Dialog Square component unmounting');
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return {
    cardContainerRef,
    payments,
    card,
    error,
    isInitialized,
    isInitializing,
    retryCount,
    setError,
    cleanup,
    retryInitialization,
    reset
  };
};
