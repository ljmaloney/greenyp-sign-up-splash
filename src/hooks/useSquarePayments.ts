
import { useState, useEffect } from 'react';
import { initializeSquare, getSquarePayments } from '@/config/square';

export interface SquareCardData {
  token: string;
  details: {
    card: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    };
  };
}

export const useSquarePayments = () => {
  const [isSquareReady, setIsSquareReady] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSquare = async () => {
      try {
        // Load Square Web SDK script
        if (!window.Square) {
          const script = document.createElement('script');
          script.src = 'https://sandbox.web.squarecdn.com/v1/square.js'; // Use production URL for live
          script.async = true;
          script.onload = async () => {
            await initializeSquare();
            setIsSquareReady(true);
          };
          script.onerror = () => {
            setError('Failed to load Square Web SDK');
          };
          document.head.appendChild(script);
        } else {
          await initializeSquare();
          setIsSquareReady(true);
        }
      } catch (err) {
        console.error('Error initializing Square:', err);
        setError('Failed to initialize Square payments');
      }
    };

    loadSquare();
  }, []);

  const initializeCard = async (cardElementId: string) => {
    if (!isSquareReady) {
      throw new Error('Square is not ready');
    }

    try {
      const payments = getSquarePayments();
      const cardInstance = await payments.card();
      await cardInstance.attach(`#${cardElementId}`);
      setCard(cardInstance);
      return cardInstance;
    } catch (err) {
      console.error('Error initializing card:', err);
      setError('Failed to initialize card form');
      throw err;
    }
  };

  const tokenizeCard = async (billingContact: any): Promise<SquareCardData> => {
    if (!card) {
      throw new Error('Card not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tokenResult = await card.tokenize({
        billingContact
      });

      if (tokenResult.status === 'OK') {
        console.log('Square tokenization successful:', tokenResult);
        return {
          token: tokenResult.token,
          details: tokenResult.details
        };
      } else {
        const errorMessage = tokenResult.errors?.map((e: any) => e.detail).join(', ') || 'Tokenization failed';
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error('Square tokenization error:', err);
      setError(err.message || 'Payment processing failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSquareReady,
    isLoading,
    error,
    initializeCard,
    tokenizeCard,
    clearError: () => setError(null)
  };
};
