
import { useEffect, useRef, useState, useCallback } from 'react';
import { validateSquareConfig } from '@/utils/squareConfigValidator';

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
  initializationPhase: string;
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
  const [initializationPhase, setInitializationPhase] = useState('idle');
  
  // Refs for cleanup and state management
  const paymentsInstanceRef = useRef<any>(null);
  const cardInstanceRef = useRef<any>(null);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const hasInitializedRef = useRef(false);

  const cleanup = useCallback(() => {
    console.log('🧹 Dialog Square cleanup');
    
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
      initializationTimeoutRef.current = null;
    }

    if (cardInstanceRef.current) {
      try {
        if (typeof cardInstanceRef.current.destroy === 'function') {
          console.log('🗑️ Destroying existing card instance');
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
      setInitializationPhase('idle');
    }
  }, []);

  const reset = useCallback(() => {
    console.log('🔄 Resetting Dialog Square payment state');
    cleanup();
    setError(null);
    setRetryCount(0);
    hasInitializedRef.current = false;
    setInitializationPhase('idle');
  }, [cleanup]);

  const waitForContainer = useCallback(async (): Promise<HTMLElement> => {
    return new Promise((resolve, reject) => {
      const maxWait = 10000;
      const startTime = Date.now();
      
      const check = () => {
        const container = document.getElementById('card-container');
        
        if (container && container.isConnected && container.offsetParent !== null) {
          console.log('✅ Container ready for dialog');
          resolve(container);
          return;
        }
        
        if (Date.now() - startTime > maxWait) {
          reject(new Error('Card container timeout in dialog'));
          return;
        }
        
        setTimeout(check, 200);
      };
      
      check();
    });
  }, []);

  const attachCard = useCallback(async (paymentsInstance: any) => {
    if (!isMountedRef.current) return;

    try {
      console.log('🎯 Starting card attachment in dialog...');
      setInitializationPhase('detecting-container');
      
      await waitForContainer();
      
      if (!isMountedRef.current) return;

      setInitializationPhase('creating-card');
      
      // Destroy any existing card instance
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

      // Create card instance with corrected camelCase properties
      console.log('🎨 Creating card with camelCase styling...');
      const cardInstance = await paymentsInstance.card({
        style: {
          '.input-container': {
            borderRadius: '8px'
          }
        }
      });
      
      setInitializationPhase('attaching-card');
      
      cardInstanceRef.current = cardInstance;
      await cardInstance.attach('#card-container');
      
      if (paymentsInstanceRef.current === paymentsInstance && isMountedRef.current) {
        setCard(cardInstance);
        setIsInitialized(true);
        setIsInitializing(false);
        setError(null);
        setInitializationPhase('ready');
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

    if (hasInitializedRef.current || isInitializing || isInitialized) {
      console.log('🔄 Square already initializing/initialized, skipping');
      return;
    }

    if (retryCount >= 3) {
      console.error('❌ Max retries reached for dialog Square');
      setError('Failed to initialize payment form after multiple attempts. Please close and reopen the dialog.');
      setInitializationPhase('failed');
      return;
    }

    console.log(`🚀 Initializing Dialog Square (attempt ${retryCount + 1}/3)`);
    
    setIsInitializing(true);
    setError(null);
    setRetryCount(prev => prev + 1);
    setInitializationPhase('validating-config');
    hasInitializedRef.current = true;

    try {
      // Step 1: Validate configuration
      const configValidation = validateSquareConfig();
      if (!configValidation.isValid) {
        throw new Error(configValidation.error || 'Invalid Square configuration');
      }

      if (!isMountedRef.current) return;

      // Step 2: Load Square SDK
      setInitializationPhase('loading-sdk');
      const { payments: paymentsFunction } = await import('@square/web-sdk');
      
      if (!isMountedRef.current) return;

      setInitializationPhase('creating-payments');
      
      const paymentsInstance = await paymentsFunction(
        configValidation.config!.appId,
        configValidation.config!.locationId
      );
      
      paymentsInstanceRef.current = paymentsInstance;
      
      if (isMountedRef.current) {
        setPayments(paymentsInstance);
        console.log('✅ Dialog payments instance created');
        
        // Step 3: Attach card with delay for dialog stability
        initializationTimeoutRef.current = setTimeout(async () => {
          try {
            if (paymentsInstanceRef.current === paymentsInstance && isMountedRef.current) {
              await attachCard(paymentsInstance);
            }
          } catch (err) {
            console.error('❌ Attachment failed:', err);
            if (isMountedRef.current) {
              setError(`Card attachment failed: ${err.message}`);
              setIsInitializing(false);
              setInitializationPhase('error');
              hasInitializedRef.current = false;
            }
          }
        }, 800);
      }
      
    } catch (err) {
      console.error('❌ Dialog Square initialization failed:', err);
      if (isMountedRef.current) {
        const errorMessage = err.message || 'Unknown initialization error';
        setError(errorMessage);
        setIsInitializing(false);
        setInitializationPhase('error');
        hasInitializedRef.current = false;
        
        // Auto-retry for certain types of errors
        if (retryCount < 3 && (
          errorMessage.includes('container') || 
          errorMessage.includes('timeout')
        )) {
          console.log(`🔄 Auto-retrying in 2 seconds...`);
          setTimeout(() => {
            if (isMountedRef.current && isDialogOpen) {
              initializeSquare();
            }
          }, 2000);
        }
      }
    }
  }, [isDialogOpen, isInitializing, isInitialized, attachCard, retryCount]);

  const retryInitialization = useCallback(() => {
    console.log('🔄 Manual retry requested for Dialog Square initialization');
    hasInitializedRef.current = false;
    cleanup();
    setError(null);
    setRetryCount(0);
    setTimeout(() => {
      if (isMountedRef.current && isDialogOpen) {
        initializeSquare();
      }
    }, 500);
  }, [cleanup, initializeSquare, isDialogOpen]);

  // Effect to handle dialog open/close and initialization
  useEffect(() => {
    isMountedRef.current = true;
    
    if (isDialogOpen) {
      console.log('🎬 Dialog opened, starting Square initialization');
      const initDelay = setTimeout(() => {
        if (isMountedRef.current && isDialogOpen && !hasInitializedRef.current) {
          initializeSquare();
        }
      }, 1000); // Increased delay for dialog rendering

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
      hasInitializedRef.current = false;
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
    reset,
    initializationPhase
  };
};
