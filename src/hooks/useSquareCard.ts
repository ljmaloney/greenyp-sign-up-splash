
import { useState, useCallback } from 'react';
import { createSquareCard } from '@/utils/squareInitialization';

export const useSquareCard = (isSquareReady: boolean, squareError: string | null) => {
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const initializeCard = useCallback(async (cardElementId: string) => {
    if (!isSquareReady) {
      console.error('Square is not ready');
      throw new Error('Square is not ready');
    }

    if (squareError) {
      console.error('Square configuration error:', squareError);
      throw new Error(`Square configuration error: ${squareError}`);
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
  }, [isSquareReady, squareError]);

  const clearError = useCallback(() => setError(null), []);

  return {
    card,
    error,
    initializeCard,
    clearError
  };
};
