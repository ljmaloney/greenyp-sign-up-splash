
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
        console.log('Loading Square SDK...');
        // Load Square Web SDK script
        if (!window.Square) {
          console.log('Square not found in window, loading script...');
          const script = document.createElement('script');
          script.src = 'https://sandbox.web.squarecdn.com/v1/square.js'; // Use production URL for live
          script.async = true;
          script.onload = async () => {
            console.log('Square script loaded successfully');
            try {
              await initializeSquare();
              console.log('Square initialized successfully');
              setIsSquareReady(true);
            } catch (initError: any) {
              console.error('Square initialization error:', initError);
              setError(initError.message || 'Failed to initialize Square payments');
            }
          };
          script.onerror = () => {
            console.error('Failed to load Square Web SDK');
            setError('Failed to load Square Web SDK');
          };
          document.head.appendChild(script);
        } else {
          console.log('Square already loaded, initializing...');
          try {
            await initializeSquare();
            console.log('Square initialized successfully');
            setIsSquareReady(true);
          } catch (initError: any) {
            console.error('Square initialization error:', initError);
            setError(initError.message || 'Failed to initialize Square payments');
          }
        }
      } catch (err: any) {
        console.error('Error loading Square:', err);
        setError(err.message || 'Failed to initialize Square payments');
      }
    };

    loadSquare();
  }, []);

  const initializeCard = async (cardElementId: string) => {
    console.log('initializeCard called with elementId:', cardElementId);
    
    if (!isSquareReady) {
      console.error('Square is not ready');
      throw new Error('Square is not ready');
    }

    if (error) {
      console.error('Square configuration error:', error);
      throw new Error(`Square configuration error: ${error}`);
    }

    try {
      const payments = getSquarePayments();
      if (!payments) {
        console.error('Square payments not initialized');
        throw new Error('Square payments not initialized');
      }
      
      console.log('Creating card instance...');
      const cardInstance = await payments.card();
      console.log('Card instance created, attaching to element:', cardElementId);
      await cardInstance.attach(`#${cardElementId}`);
      console.log('Card attached successfully');
      setCard(cardInstance);
      return cardInstance;
    } catch (err: any) {
      console.error('Error initializing card:', err);
      const errorMessage = err.message || 'Failed to initialize card form';
      setError(errorMessage);
      throw new Error(errorMessage);
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
        console.error('Square tokenization failed:', tokenResult);
        
        // Better error handling for Square API errors
        let errorMessage = 'Payment information is invalid';
        
        if (tokenResult.errors && Array.isArray(tokenResult.errors)) {
          const errorMessages = tokenResult.errors
            .map((error: any) => {
              if (error.detail) return error.detail;
              if (error.message) return error.message;
              if (typeof error === 'string') return error;
              return null;
            })
            .filter(Boolean);
          
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('. ');
          }
        }
        
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error('Square tokenization error:', err);
      const errorMessage = err.message || 'Payment processing failed';
      setError(errorMessage);
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
