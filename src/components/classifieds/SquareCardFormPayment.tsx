
import React from 'react';
import { Label } from '@/components/ui/label';

interface SquareCardFormPaymentProps {
  cardElementRef: React.RefObject<HTMLDivElement>;
  isSquareReady: boolean;
  error: string | null;
  isProcessing: boolean;
}

const SquareCardFormPayment = ({ cardElementRef, isSquareReady, error, isProcessing }: SquareCardFormPaymentProps) => {
  const hasSquareCredentials = import.meta.env.VITE_SQUARE_APPLICATION_ID && import.meta.env.VITE_SQUARE_LOCATION_ID;

  return (
    <div>
      <Label>Card Information *</Label>
      <div 
        id="square-card" 
        ref={cardElementRef}
        className="min-h-[60px] border border-gray-300 rounded-md p-3 bg-white"
        style={{
          opacity: (isSquareReady && !error) ? 1 : 0.5,
          pointerEvents: (isProcessing || error) ? 'none' : 'auto'
        }}
      >
        {(!isSquareReady || error) && (
          <div className="flex items-center justify-center h-full text-gray-500">
            {error ? (
              !hasSquareCredentials ? (
                <div className="text-center">
                  <p className="text-sm">Development Mode</p>
                  <p className="text-xs mt-1">Configure Square credentials to enable payments</p>
                </div>
              ) : (
                'Payment form unavailable - configuration required'
              )
            ) : (
              'Loading secure payment form...'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SquareCardFormPayment;
