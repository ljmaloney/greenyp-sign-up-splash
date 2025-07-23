
import { useEffect, useRef, useState, useCallback } from 'react';
import { validateSquareConfig, preloadSquareSDK } from '@/utils/squareConfigValidator';
import { detectSquareContainer } from '@/utils/squareContainerDetector';
import { SquareRetryManager } from '@/utils/squareRetryManager';

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
  const retryManagerRef = useRef(new SquareRetryManager({ maxAttempts: 5 }));
  const currentInitializationId = useRef(0);

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
    retryManagerRef.current.reset();
    currentInitializationId.current++;
    setInitializationPhase('idle');
  }, [cleanup]);

  const attachCard = useCallback(async (paymentsInstance: any, initId: number) => {
    if (!isMountedRef.current || currentInitializationId.current !== initId) {
      console.log('🚫 Attachment cancelled - component unmounted or superseded');
      return;
    }

    try {
      console.log('🎯 Starting card attachment process...');
      setInitializationPhase('detecting-container');
      
      // Use robust container detection
      const containerResult = await detectSquareContainer({
        containerId: 'card-container',
        maxWaitTime: 12000,
        checkInterval: 300,
        requireVisible: true
      });

      if (!containerResult.success) {
        throw new Error(containerResult.error || 'Container detection failed');
      }

      if (currentInitializationId.current !== initId) {
        console.log('🚫 Attachment cancelled during container detection');
        return;
      }

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

      // Create new card instance with enhanced styling
      const cardInstance = await paymentsInstance.card({
        style: {
          '.input-container': {
            borderColor: '#E2E8F0',
            borderRadius: '6px',
            fontSize: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          },
          '.input-container.is-focus': {
            borderColor: '#3B82F6',
            boxShadow: '0 0 0 1px #3B82F6'
          },
          '.input-container.is-error': {
            borderColor: '#EF4444'
          },
          '.message-text': {
            fontSize: '14px',
            color: '#6B7280'
          },
          '.message-text.is-error': {
            color: '#EF4444'
          }
        }
      });
      
      if (currentInitializationId.current !== initId) {
        console.log('🚫 Attachment cancelled during card creation');
        if (typeof cardInstance.destroy === 'function') {
          cardInstance.destroy();
        }
        return;
      }

      setInitializationPhase('attaching-card');
      
      cardInstanceRef.current = cardInstance;
      await cardInstance.attach('#card-container');
      
      if (paymentsInstanceRef.current === paymentsInstance && 
          isMountedRef.current && 
          currentInitializationId.current === initId) {
        setCard(cardInstance);
        setIsInitialized(true);
        setIsInitializing(false);
        setError(null);
        setInitializationPhase('ready');
        retryManagerRef.current.reset();
        console.log('✅ Card attached successfully to dialog');
      }
    } catch (err) {
      console.error('❌ Card attachment failed in dialog:', err);
      throw err;
    }
  }, []);

  const initializeSquare = useCallback(async () => {
    if (!isDialogOpen) {
      console.log('🚫 Dialog not open, skipping Square initialization');
      return;
    }

    if (isInitializing || isInitialized) {
      console.log('🔄 Square already initializing/initialized, skipping');
      return;
    }

    const retryStrategy = retryManagerRef.current.getNextStrategy();
    if (!retryStrategy) {
      console.error('❌ Max retries reached for dialog Square');
      setError(`Failed after ${retryManagerRef.current.getCurrentAttempt()} attempts. Please refresh the page and try again.`);
      setInitializationPhase('failed');
      return;
    }

    const initId = ++currentInitializationId.current;
    console.log(`🚀 Initializing Dialog Square (attempt ${retryStrategy.attempt}/${retryStrategy.maxAttempts}): ${retryStrategy.reason}`);
    
    setIsInitializing(true);
    setError(null);
    setRetryCount(retryStrategy.attempt);
    setInitializationPhase('validating-config');

    try {
      // Step 1: Validate configuration
      const configValidation = validateSquareConfig();
      if (!configValidation.isValid) {
        throw new Error(configValidation.error || 'Invalid Square configuration');
      }

      if (currentInitializationId.current !== initId) return;

      setInitializationPhase('preloading-sdk');

      // Step 2: Pre-load SDK (optional optimization)
      const sdkPreloaded = await preloadSquareSDK();
      if (!sdkPreloaded) {
        console.warn('⚠️ SDK pre-loading failed, continuing with dynamic import');
      }

      if (currentInitializationId.current !== initId) return;

      setInitializationPhase('loading-sdk');

      // Step 3: Import and initialize Square SDK
      const { payments: paymentsFunction } = await import('@square/web-sdk');
      
      if (currentInitializationId.current !== initId) return;

      setInitializationPhase('creating-payments');
      
      const paymentsInstance = await paymentsFunction(
        configValidation.config!.appId,
        configValidation.config!.locationId
      );
      
      paymentsInstanceRef.current = paymentsInstance;
      
      if (isMountedRef.current && currentInitializationId.current === initId) {
        setPayments(paymentsInstance);
        console.log('✅ Dialog payments instance created');
        
        // Step 4: Wait before attachment to ensure dialog is fully rendered
        const attachmentDelay = retryStrategy.attempt === 1 ? 1000 : retryStrategy.delay;
        
        initializationTimeoutRef.current = setTimeout(async () => {
          try {
            if (paymentsInstanceRef.current === paymentsInstance && 
                isMountedRef.current && 
                currentInitializationId.current === initId) {
              await attachCard(paymentsInstance, initId);
            }
          } catch (err) {
            console.error('❌ Dialog attachment failed:', err);
            if (isMountedRef.current && currentInitializationId.current === initId) {
              const errorMessage = err.message || 'Unknown attachment error';
              setError(errorMessage);
              setIsInitializing(false);
              setInitializationPhase('error');
              
              // Auto-retry with progressive delay
              if (retryManagerRef.current.canRetry()) {
                console.log(`🔄 Auto-retrying in ${retryStrategy.delay}ms...`);
                setTimeout(() => {
                  if (isMountedRef.current && isDialogOpen && currentInitializationId.current === initId) {
                    initializeSquare();
                  }
                }, retryStrategy.delay);
              }
            }
          }
        }, attachmentDelay);
      }
      
    } catch (err) {
      console.error('❌ Dialog Square initialization failed:', err);
      if (isMountedRef.current && currentInitializationId.current === initId) {
        const errorMessage = err.message || 'Unknown initialization error';
        setError(errorMessage);
        setIsInitializing(false);
        setInitializationPhase('error');
        
        // Auto-retry with progressive delay
        if (retryManagerRef.current.canRetry()) {
          console.log(`🔄 Auto-retrying in ${retryStrategy.delay}ms...`);
          setTimeout(() => {
            if (isMountedRef.current && isDialogOpen && currentInitializationId.current === initId) {
              initializeSquare();
            }
          }, retryStrategy.delay);
        }
      }
    }
  }, [isDialogOpen, isInitializing, isInitialized, attachCard]);

  const retryInitialization = useCallback(() => {
    console.log('🔄 Manual retry requested for Dialog Square initialization');
    retryManagerRef.current.reset();
    cleanup();
    setError(null);
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
        if (isMountedRef.current && isDialogOpen) {
          initializeSquare();
        }
      }, 300); // Slight delay to ensure dialog is rendered

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
    reset,
    initializationPhase
  };
};
