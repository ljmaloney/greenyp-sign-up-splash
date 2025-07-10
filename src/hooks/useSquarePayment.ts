
import { useEffect, useRef, useState } from 'react';

export const useSquarePayment = () => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSquare = async () => {
      try {
        // Use environment variables for Square configuration
        const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
        const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
        
        if (!appId || !locationId) {
          throw new Error('Square application ID or location ID not configured');
        }

        // Dynamically import Square Web SDK
        const { payments: paymentsFunction } = await import('@square/web-sdk');
        
        // Initialize Square Payments
        const paymentsInstance = await paymentsFunction(appId, locationId);
        
        setPayments(paymentsInstance);
        
        // Create and attach card
        const cardInstance = await paymentsInstance.card();
        await cardInstance.attach('#card-container');
        setCard(cardInstance);
        
        console.log('Square payment card initialized successfully');
      } catch (err) {
        console.error('Failed to initialize Square payments:', err);
        setError('Failed to initialize payment form');
      }
    };

    initializeSquare();
  }, []);

  return {
    cardContainerRef,
    payments,
    card,
    error,
    setError
  };
};
