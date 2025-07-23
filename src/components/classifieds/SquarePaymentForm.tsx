
import React from 'react';
import { Button } from '@/components/ui/button';

interface SquarePaymentFormProps {
  cardContainerRef: React.RefObject<HTMLDivElement>;
  error: string | null;
  isProcessing: boolean;
  onPayment: () => void;
  isCardReady: boolean;
  showButton?: boolean;
  buttonText?: string;
  processingText?: string;
}

const SquarePaymentForm = ({ 
  cardContainerRef, 
  error, 
  isProcessing, 
  onPayment, 
  isCardReady,
  showButton = true,
  buttonText = 'Process Payment',
  processingText = 'Processing Payment...'
}: SquarePaymentFormProps) => {
  return (
    <div className="space-y-4">
      <div 
        id="card-container" 
        ref={cardContainerRef}
        className="p-4 border border-gray-300 rounded-lg min-h-[120px]"
      />
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
      
      {showButton && (
        <Button 
          onClick={onPayment}
          disabled={isProcessing || !isCardReady}
          className="w-full"
        >
          {isProcessing ? processingText : buttonText}
        </Button>
      )}
    </div>
  );
};

export default SquarePaymentForm;
