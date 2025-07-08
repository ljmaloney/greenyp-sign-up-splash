
import { useSquareInitialization } from './useSquareInitialization';
import { useSquareCard } from './useSquareCard';
import { useSquareTokenization } from './useSquareTokenization';

export { SquareCardData } from '@/types/square';

export const useSquarePayments = () => {
  const { isSquareReady, error: initError, clearError: clearInitError } = useSquareInitialization();
  const { card, error: cardError, initializeCard, clearError: clearCardError } = useSquareCard(isSquareReady, initError);
  const { isLoading, error: tokenError, tokenizeCard, clearError: clearTokenError } = useSquareTokenization(card);

  // Combine errors from all sources
  const error = initError || cardError || tokenError;

  const clearError = () => {
    clearInitError();
    clearCardError();
    clearTokenError();
  };

  return {
    isSquareReady,
    isLoading,
    error,
    initializeCard,
    tokenizeCard,
    clearError
  };
};
