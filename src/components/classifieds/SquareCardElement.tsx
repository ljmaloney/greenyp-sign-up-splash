
import React, { useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { useSquarePayments } from '@/hooks/useSquarePayments';
import { useToast } from '@/hooks/use-toast';

interface SquareCardElementProps {
  onCardInitialized: (cardInstance: any) => void;
}

const SquareCardElement = ({ onCardInitialized }: SquareCardElementProps) => {
  const { toast } = useToast();
  const { isSquareReady, error, card, isCardInitialized, initializeCard } = useSquarePayments();
  const cardElementRef = useRef<HTMLDivElement>(null);
  const hasAttemptedInit = useRef(false);

  useEffect(() => {
    const initializeCardInstance = async () => {
      if (hasAttemptedInit.current || !isSquareReady || error || !cardElementRef.current || isCardInitialized) {
        return;
      }

      hasAttemptedInit.current = true;

      try {
        console.log('Initializing Square card...');
        const cardInstance = await initializeCard('square-card-element');
        onCardInitialized(cardInstance);
        console.log('Square card initialized successfully');
      } catch (initError: any) {
        console.error('Failed to initialize Square card:', initError);
        toast({
          title: "Payment Error",
          description: initError.message || "Failed to initialize payment form.",
          variant: "destructive"
        });
        hasAttemptedInit.current = false; // Allow retry
      }
    };

    if (isSquareReady && !error && !isCardInitialized) {
      initializeCardInstance();
    }
  }, [isSquareReady, error, isCardInitialized, initializeCard, onCardInitialized, toast]);

  // Notify parent when card is available
  useEffect(() => {
    if (card && isCardInitialized) {
      onCardInitialized(card);
    }
  }, [card, isCardInitialized, onCardInitialized]);

  return (
    <div>
      <Label>Card Information *</Label>
      <div 
        id="square-card-element" 
        ref={cardElementRef}
        className="min-h-[60px] border border-gray-300 rounded-md p-3 bg-white"
        style={{
          opacity: (isSquareReady && !error) ? 1 : 0.5,
          pointerEvents: error ? 'none' : 'auto'
        }}
      >
        {(!isSquareReady || error) && (
          <div className="flex items-center justify-center h-full text-gray-500">
            {error ? (
              <div className="text-center">
                <p className="text-sm">Development Mode</p>
                <p className="text-xs mt-1">Configure Square credentials to enable payments</p>
              </div>
            ) : (
              'Loading secure payment form...'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SquareCardElement;
