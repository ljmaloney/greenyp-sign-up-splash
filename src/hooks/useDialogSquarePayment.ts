
import { useEffect, useRef, useState, useCallback } from 'react';
import { validateSquareConfig, preloadSquareSDK } from '@/utils/squareConfigValidator';
import { detectSquareContainer } from '@/utils/squareContainerDetector';

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
    currentInitializationId.current++;
    setInitializationPhase('idle');
  }, [cleanup]);

  const waitForDialogStability = useCallback(async (delay: number = 1500) => {
    console.log(`⏳ Waiting ${delay}ms for dialog stability...`);
    return new Promise(resolve => setTimeout(resolve, delay));
  }, []);

  const attachCard = useCallback(async (paymentsInstance: any, initId: number) => {
    if (!isMountedRef.current || currentInitializationId.current !== initId) {
      console.log('🚫 Attachment cancelled - component unmounted or superseded');
      return;
    }

    try {
      console.log('🎯 Starting card attachment process...');
      setInitializationPhase('detecting-container');
      
      // Enhanced container detection for dialogs
      const containerResult = await detectSquareContainer({
        containerId: 'card-container',
        maxWaitTime: 15000,
        checkInterval: 200,
        requireVisible: true,
        requireStable: true
      });

      if (!containerResult.success) {
        throw new Error(containerResult.error || 'Container detection failed');
      }

      console.log('✅ Container detected and stable');

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

      // Create card instance with minimal, proven styling
      console.log('🎨 Creating card with minimal styling...');
      const cardInstance = await paymentsInstance.card({
        style: {
          // Use only essential styles that are known to work
          '.input-container': {
            'border-radius': '8px'
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

    const currentRetry = retryCount + 1;
    if (currentRetry > 3) {
      console.error('❌ Max retries reached for dialog Square');
      setError('Failed to initialize payment form after multiple attempts. Please close and reopen the dialog.');
      setInitializationPhase('failed');
      return;
    }

    const initId = ++currentInitializationId.current;
    console.log(`🚀 Initializing Dialog Square (attempt ${currentRetry}/3)`);
    
    setIsInitializing(true);
    setError(null);
    setRetryCount(currentRetry);
    setInitializationPhase('validating-config');

    try {
      // Step 1: Wait for dialog to be fully rendered and stable
      await waitForDialogStability(currentRetry === 1 ? 1500 : 2000);

      // Step 2: Validate configuration
      setInitializationPhase('validating-config');
      const configValidation = validateSquareConfig();
      if (!configValidation.isValid) {
        throw new Error(configValidation.error || 'Invalid Square configuration');
      }

      if (currentInitializationId.current !== initId) return;

      // Step 3: Load Square SDK
      setInitializationPhase('loading-sdk');
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
        
        // Step 4: Attach card with additional delay for stability
        await attachCard(paymentsInstance, initId);
      }
      
    } catch (err) {
      console.error('❌ Dialog Square initialization failed:', err);
      if (isMountedRef.current && currentInitializationId.current === initId) {
        const errorMessage = err.message || 'Unknown initialization error';
        setError(errorMessage);
        setIsInitializing(false);
        setInitializationPhase('error');
        
        // Auto-retry for certain types of errors
        if (currentRetry < 3 && (
          errorMessage.includes('container') || 
          errorMessage.includes('InvalidStylesError') ||
          errorMessage.includes('timeout')
        )) {
          console.log(`🔄 Auto-retrying in 2 seconds...`);
          setTimeout(() => {
            if (isMountedRef.current && isDialogOpen && currentInitializationId.current === initId) {
              initializeSquare();
            }
          }, 2000);
        }
      }
    }
  }, [isDialogOpen, isInitializing, isInitialized, attachCard, waitForDialogStability, retryCount]);

  const retryInitialization = useCallback(() => {
    console.log('🔄 Manual retry requested for Dialog Square initialization');
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
        if (isMountedRef.current && isDialogOpen) {
          initializeSquare();
        }
      }, 800); // Increased delay for dialog rendering

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
