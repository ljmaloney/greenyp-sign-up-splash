
import React, { useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { useSquarePayments } from '@/hooks/useSquarePayments';
import { useToast } from '@/hooks/use-toast';

interface SquareCardElementProps {
  isSquareReady: boolean;
  error: string | null;
  onCardInitialized: (cardInstance: any) => void;
}

const SquareCardElement = ({ isSquareReady, error, onCardInitialized }: SquareCardElementProps) => {
  const { toast } = useToast();
  const { initializeCard } = useSquarePayments();
  const cardElementRef = useRef<HTMLDivElement>(null);
  const cardInstanceRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const initializeCardInstance = async () => {
      if (isInitializedRef.current || !isSquareReady || error || !cardElementRef.current) {
        return;
      }

      try {
        console.log('Initializing Square card...');
        const cardInstance = await initializeCard('square-card-element');
        
        if (isMounted) {
          cardInstanceRef.current = cardInstance;
          isInitializedRef.current = true;
          onCardInitialized(cardInstance);
          console.log('Square card initialized successfully');
        }
      } catch (initError: any) {
        console.error('Failed to initialize Square card:', initError);
        if (isMounted) {
          toast({
            title: "Payment Error",
            description: initError.message || "Failed to initialize payment form.",
            variant: "destructive"
          });
        }
      }
    };

    if (isSquareReady && !error && !isInitializedRef.current) {
      initializeCardInstance();
    }

    return () => {
      isMounted = false;
      if (cardInstanceRef.current && isInitializedRef.current) {
        try {
          cardInstanceRef.current.destroy();
        } catch (destroyError) {
          console.warn('Error destroying card instance:', destroyError);
        }
        cardInstanceRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [isSquareReady, error, initializeCard, onCardInitialized, toast]);

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
