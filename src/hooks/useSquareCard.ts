
import { useState, useCallback } from 'react';
import { createSquareCard } from '@/utils/squareInitialization';

export const useSquareCard = (isSquareReady: boolean, squareError: string | null) => {
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeCard = useCallback(async (cardElementId: string) => {
    if (!isSquareReady) {
      console.error('Square is not ready');
      throw new Error('Square is not ready');
    }

    if (squareError) {
      console.error('Square configuration error:', squareError);
      throw new Error(`Square configuration error: ${squareError}`);
    }

    // Don't initialize if already initialized
    if (isInitialized && card) {
      console.log('Card already initialized, returning existing instance');
      return card;
    }

    try {
      console.log('Initializing card with element ID:', cardElementId);
      const cardInstance = await createSquareCard(cardElementId);
      setCard(cardInstance);
      setIsInitialized(true);
      setError(null);
      console.log('Card initialized and state updated successfully');
      return cardInstance;
    } catch (err: any) {
      console.error('Error initializing card:', err);
      const errorMessage = err.message || 'Failed to initialize card form';
      setError(errorMessage);
      setIsInitialized(false);
      setCard(null);
      throw new Error(errorMessage);
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
