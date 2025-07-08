
import { useState, useCallback } from 'react';
import { createSquareCard } from '@/utils/squareInitialization';

export const useSquareCard = (isSquareReady: boolean, squareError: string | null) => {
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeCard = useCallback(async (cardElementId: string) => {
    if (!isSquareReady) {
      console.error('Square is not ready');
      setError('Square is not ready');
      return null;
    }

    if (squareError) {
      console.error('Square configuration error:', squareError);
      setError(`Square configuration error: ${squareError}`);
      return null;
    }

    // Don't initialize if already initialized
    if (isInitialized && card) {
      console.log('Card already initialized, returning existing instance');
      return card;
    }

    try {
      console.log('Initializing card with element ID:', cardElementId);
      setError(null);
      const cardInstance = await createSquareCard(cardElementId);
      setCard(cardInstance);
      setIsInitialized(true);
      console.log('Card initialized and state updated successfully');
      return cardInstance;
    } catch (err: any) {
      console.error('Error initializing card:', err);
      const errorMessage = err.message || 'Failed to initialize card form';
      setError(errorMessage);
      setIsInitialized(false);
      setCard(null);
      return null;
    }
  }, [isSquareReady, squareError, isInitialized, card]);

  const clearError = useCallback(() => setError(null), []);

  const resetCard = useCallback(() => {
    setCard(null);
    setIsInitialized(false);
    setError(null);
  }, []);

  return {
    card,
    error,
    isInitialized,
    initializeCard,
    clearError,
    resetCard
  };
};
