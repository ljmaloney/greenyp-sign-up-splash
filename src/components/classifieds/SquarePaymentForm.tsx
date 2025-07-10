
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SquarePaymentFormProps {
  cardContainerRef: React.RefObject<HTMLDivElement>;
  error: string | null;
  isProcessing: boolean;
  onPayment: () => void;
  isCardReady: boolean;
}

const SquarePaymentForm = ({ 
  cardContainerRef, 
  error, 
  isProcessing, 
  onPayment, 
  isCardReady 
}: SquarePaymentFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        
        <Button 
          onClick={onPayment}
          disabled={isProcessing || !isCardReady}
          className="w-full"
        >
          {isProcessing ? 'Processing Payment...' : 'Process Payment'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SquarePaymentForm;
