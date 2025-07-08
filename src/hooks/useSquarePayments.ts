
import { useState, useEffect, useCallback } from 'react';
import { SquareCardData } from '@/types/square';
import { initializeSquarePayments, createSquareCard } from '@/utils/squareInitialization';
import { processTokenization } from '@/utils/squareUtils';

export const useSquarePayments = () => {
  const [isSquareReady, setIsSquareReady] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const initializeCard = useCallback(async (cardElementId: string) => {
    if (!isSquareReady) {
      console.error('Square is not ready');
      throw new Error('Square is not ready');
    }

    if (error) {
      console.error('Square configuration error:', error);
      throw new Error(`Square configuration error: ${error}`);
    }

    try {
      const cardInstance = await createSquareCard(cardElementId);
      setCard(cardInstance);
      return cardInstance;
    } catch (err: any) {
      console.error('Error initializing card:', err);
      const errorMessage = err.message || 'Failed to initialize card form';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isSquareReady, error]);

  const tokenizeCard = useCallback(async (billingContact: any): Promise<SquareCardData> => {
    if (!card) {
      throw new Error('Card not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tokenData = await processTokenization(card, billingContact);
      return tokenData;
    } catch (err: any) {
      console.error('Square tokenization error:', err);
      const errorMessage = err.message || 'Payment processing failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [card]);

  const clearError = useCallback(() => setError(null), []);

  return {
    isSquareReady,
    isLoading,
    error,
    initializeCard,
    tokenizeCard,
    clearError
  };
};
