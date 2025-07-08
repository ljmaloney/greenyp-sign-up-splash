
import React from 'react';
import { Label } from '@/components/ui/label';

interface SquareCardFormPaymentProps {
  cardElementRef: React.RefObject<HTMLDivElement>;
  isSquareReady: boolean;
  error: string | null;
  isProcessing: boolean;
}

const SquareCardFormPayment = ({ cardElementRef, isSquareReady, error, isProcessing }: SquareCardFormPaymentProps) => {
  console.log('SquareCardFormPayment render - isSquareReady:', isSquareReady, 'error:', error, 'isProcessing:', isProcessing);

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
            {error ? 'Payment form unavailable - configuration required' : 'Loading secure payment form...'}
          </div>
        )}
      </div>
      {console.log('Square card element div rendered with ID: square-card')}
    </div>
  );
};

export default SquareCardFormPayment;
