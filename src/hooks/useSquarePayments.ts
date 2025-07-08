
import { useState, useEffect, useCallback } from 'react';
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
    let isMounted = true;

    const loadSquare = async () => {
      try {
        console.log('Loading Square SDK...');
        setError(null);
        
        await initializeSquare();
        
        if (isMounted) {
          console.log('Square initialized successfully');
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
      
      // Wait a bit for the DOM element to be ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
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
  }, [isSquareReady, error]);

  const tokenizeCard = useCallback(async (billingContact: any): Promise<SquareCardData> => {
    if (!card) {
      throw new Error('Card not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting tokenization with billingContact:', billingContact);
      
      // Create a simple tokenization request - Square's mock doesn't need verificationDetails
      const tokenizationRequest = {
        billingContact: {
          givenName: billingContact.givenName || '',
          familyName: billingContact.familyName || '',
          email: billingContact.email || '',
          phone: billingContact.phone || ''
        }
      };

      console.log('Tokenization request:', tokenizationRequest);

      const tokenResult = await card.tokenize(tokenizationRequest);
      console.log('Tokenization result:', tokenResult);

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
