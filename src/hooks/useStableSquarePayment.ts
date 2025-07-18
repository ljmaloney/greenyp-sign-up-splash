
import { useEffect, useRef, useState, useCallback } from 'react';
import { validateSquareConfiguration } from '@/utils/paymentValidation';

interface SquarePaymentHookResult {
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
}

export const useStableSquarePayment = (): SquarePaymentHookResult => {
  console.log('🔄 useStableSquarePayment hook called');
  
  // Always call hooks in the same order
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Refs for cleanup
  const paymentsInstanceRef = useRef<any>(null);
  const cardInstanceRef = useRef<any>(null);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const hasInitializedRef = useRef(false);

  const maxRetries = 3;

  const cleanup = useCallback(() => {
    console.log('🧹 Stable Square cleanup');
    
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

  const waitForContainer = useCallback(async (): Promise<HTMLElement> => {
    return new Promise((resolve, reject) => {
      const maxWait = 5000;
      const startTime = Date.now();
      
      const check = () => {
        const container = document.getElementById('card-container');
        
        if (container && container.isConnected) {
          resolve(container);
          return;
        }
        
        if (Date.now() - startTime > maxWait) {
          reject(new Error('Card container timeout'));
          return;
        }
        
        setTimeout(check, 100);
      };
      
      check();
    });
  }, []);

  const attachCard = useCallback(async (paymentsInstance: any) => {
    if (!isMountedRef.current) return;

    try {
      console.log('🎯 Attaching card...');
      
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
      
      if (paymentsInstanceRef.current === paymentsInstance && isMountedRef.current) {
        setCard(cardInstance);
        setIsInitialized(true);
        setIsInitializing(false);
        setError(null);
        console.log('✅ Card attached successfully');
      }
    } catch (err) {
      console.error('❌ Card attachment failed:', err);
      throw err;
    }
  }, [waitForContainer]);

  const initializeSquare = useCallback(async () => {
    if (hasInitializedRef.current || isInitializing || isInitialized) {
      console.log('🔄 Square already initializing/initialized, skipping');
      return;
    }

    if (retryCount >= maxRetries) {
      console.error('❌ Max retries reached');
      setError(`Failed after ${maxRetries} attempts`);
      return;
    }

    console.log(`🚀 Initializing Square (attempt ${retryCount + 1}/${maxRetries})`);
    
    const configError = validateSquareConfiguration();
    if (configError) {
      setError(configError);
      return;
    }

    setIsInitializing(true);
    setError(null);
    hasInitializedRef.current = true;

    try {
      const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
      const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

      const { payments: paymentsFunction } = await import('@square/web-sdk');
      const paymentsInstance = await paymentsFunction(appId, locationId);
      
      paymentsInstanceRef.current = paymentsInstance;
      
      if (isMountedRef.current) {
        setPayments(paymentsInstance);
      }
      
      console.log('✅ Payments instance created');
      
      initializationTimeoutRef.current = setTimeout(async () => {
        try {
          if (paymentsInstanceRef.current === paymentsInstance && isMountedRef.current) {
            await attachCard(paymentsInstance);
          }
        } catch (err) {
          console.error('❌ Attachment failed:', err);
          if (isMountedRef.current) {
            setError(`Initialization failed: ${err.message}`);
            setIsInitializing(false);
            setRetryCount(prev => prev + 1);
            hasInitializedRef.current = false;
          }
        }
      }, 500);
      
    } catch (err) {
      console.error('❌ Square initialization failed:', err);
      if (isMountedRef.current) {
        setError(`Failed to initialize: ${err.message}`);
        setIsInitializing(false);
        setRetryCount(prev => prev + 1);
        hasInitializedRef.current = false;
      }
    }
  }, [isInitializing, isInitialized, retryCount, attachCard]);

  const retryInitialization = useCallback(() => {
    console.log('🔄 Retrying Square initialization');
    hasInitializedRef.current = false;
    cleanup();
    setTimeout(() => {
      if (isMountedRef.current) {
        initializeSquare();
      }
    }, 1000);
  }, [cleanup, initializeSquare]);

  // Single useEffect to prevent hook order issues
  useEffect(() => {
    console.log('🎬 Stable Square effect triggered');
    isMountedRef.current = true;
    
    const initDelay = setTimeout(() => {
      if (isMountedRef.current && !hasInitializedRef.current) {
        initializeSquare();
      }
    }, 100);

    return () => {
      console.log('🧹 Stable Square cleanup');
      clearTimeout(initDelay);
      isMountedRef.current = false;
      hasInitializedRef.current = false;
      cleanup();
    };
  }, []); // Empty dependency array to prevent re-initialization

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
    retryInitialization
  };
};
