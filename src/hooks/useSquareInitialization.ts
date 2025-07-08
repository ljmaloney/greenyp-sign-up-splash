
import { useState, useEffect } from 'react';
import { initializeSquarePayments } from '@/utils/squareInitialization';

export const useSquareInitialization = () => {
  const [isSquareReady, setIsSquareReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSquare = async () => {
      try {
        setError(null);
        await initializeSquarePayments();
        
        if (isMounted) {
          setIsSquareReady(true);
        }
      } catch (err: any) {
        console.error('Error loading Square:', err);
        if (isMounted) {
          setError(err.message || 'Failed to initialize Square payments');
        }
      }
    };

    loadSquare();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isSquareReady,
    error,
    clearError: () => setError(null)
  };
};
