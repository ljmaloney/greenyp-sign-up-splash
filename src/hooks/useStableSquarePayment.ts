
import { useRef, useState, useEffect, useCallback } from 'react';
import { SquareRetryManager } from '@/utils/squareRetryManager';

interface UseStableSquarePaymentReturn {
  cardContainerRef: React.RefObject<HTMLDivElement>;
  payments: any;
  card: any;
  error: string | null;
  isInitialized: boolean;
  isInitializing: boolean;
  retryCount: number;
  setError: (error: string | null) => void;
  retryInitialization: () => void;
}

export const useStableSquarePayment = (): UseStableSquarePaymentReturn => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const retryManager = useRef(new SquareRetryManager());

  const initializeSquare = useCallback(async () => {
    if (isInitializing || isInitialized) {
      console.log('🔄 Square already initializing or initialized, skipping...');
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      console.log('🏗️ Initializing Square SDK...');
      
      // For now, we'll simulate successful initialization
      // In a real implementation, you would initialize the actual Square SDK here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPayments({ initialized: true });
      setCard({ ready: true });
      setIsInitialized(true);
      retryManager.current.reset();
      
      console.log('✅ Square SDK initialized successfully');
    } catch (err) {
      console.error('❌ Square SDK initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Square initialization failed');
      
      const strategy = retryManager.current.getNextStrategy();
      if (strategy) {
        console.log(`🔄 Will retry in ${strategy.delay}ms (attempt ${strategy.attempt}/${strategy.maxAttempts})`);
        setTimeout(() => {
          setIsInitializing(false);
          initializeSquare();
        }, strategy.delay);
      }
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing, isInitialized]);

  const retryInitialization = useCallback(() => {
    retryManager.current.reset();
    setIsInitialized(false);
    setError(null);
    initializeSquare();
  }, [initializeSquare]);

  useEffect(() => {
    initializeSquare();
  }, [initializeSquare]);

  return {
    cardContainerRef,
    payments,
    card,
    error,
    isInitialized,
    isInitializing,
    retryCount: retryManager.current.getCurrentAttempt(),
    setError,
    retryInitialization
  };
};
