
import { useState, useEffect, useCallback } from 'react';
import { getSquareConfig } from '@/utils/squareConfig';

interface UseSquarePaymentReturn {
  isLoading: boolean;
  error: string | null;
  isReady: boolean;
  payments: any;
  card: any;
  retryInitialization: () => void;
}

export const useSquarePayment = (): UseSquarePaymentReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);

  const initializeSquare = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const config = getSquareConfig();
      console.log('🏗️ Initializing Square with config:', config);
      
      // For now, simulate successful initialization
      // In production, this would use the actual Square SDK
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPayments({ initialized: true });
      setCard({ ready: true });
      setIsReady(true);
      
      console.log('✅ Square payment system initialized');
    } catch (err) {
      console.error('❌ Square initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Square initialization failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retryInitialization = useCallback(() => {
    setError(null);
    setIsReady(false);
    initializeSquare();
  }, [initializeSquare]);

  useEffect(() => {
    initializeSquare();
  }, [initializeSquare]);

  return {
    isLoading,
    error,
    isReady,
    payments,
    card,
    retryInitialization
  };
};
