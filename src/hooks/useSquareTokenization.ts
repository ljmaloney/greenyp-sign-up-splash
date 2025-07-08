
import { useState, useCallback } from 'react';
import { SquareCardData } from '@/types/square';
import { processTokenization } from '@/utils/squareUtils';

export const useSquareTokenization = (card: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    isLoading,
    error,
    tokenizeCard,
    clearError
  };
};
