
import { useEffect, useRef, useState, useCallback } from 'react';

export const useSquarePayment = () => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const attachCard = useCallback(async (paymentsInstance: any, retryCount = 0) => {
    const maxRetries = 5;
    const retryDelay = 100;

    // Check if DOM element exists
    const cardContainer = document.getElementById('card-container');
    if (!cardContainer && retryCount < maxRetries) {
      console.log(`Card container not found, retrying... (${retryCount + 1}/${maxRetries})`);
      setTimeout(() => attachCard(paymentsInstance, retryCount + 1), retryDelay);
      return;
    }

    if (!cardContainer) {
      throw new Error('Card container element not found after maximum retries');
    }

    try {
      console.log('Creating and attaching Square card...');
      const cardInstance = await paymentsInstance.card();
      await cardInstance.attach('#card-container');
      setCard(cardInstance);
      console.log('Square payment card attached successfully');
    } catch (err) {
      console.error('Failed to attach Square card:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    const initializeSquare = async () => {
      if (isInitialized) return;

      try {
        // Use environment variables for Square configuration
        const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
        const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
        
        if (!appId || !locationId) {
          throw new Error('Square application ID or location ID not configured');
        }

        console.log('Initializing Square Web SDK...');
        
        // Dynamically import Square Web SDK
        const { payments: paymentsFunction } = await import('@square/web-sdk');
        
        // Initialize Square Payments
        const paymentsInstance = await paymentsFunction(appId, locationId);
        setPayments(paymentsInstance);
        
        console.log('Square payments instance created, waiting for DOM...');
        
        // Wait a bit for the DOM to be ready, then attempt to attach
        setTimeout(async () => {
          try {
            await attachCard(paymentsInstance);
            setIsInitialized(true);
          } catch (err) {
            console.error('Failed to initialize Square card:', err);
            setError('Failed to initialize payment form');
          }
        }, 100);
        
      } catch (err) {
        console.error('Failed to initialize Square payments:', err);
        setError('Failed to initialize payment form');
      }
    };

    initializeSquare();
  }, [attachCard, isInitialized]);

  return {
    cardContainerRef,
    payments,
    card,
    error,
    setError
  };
};
