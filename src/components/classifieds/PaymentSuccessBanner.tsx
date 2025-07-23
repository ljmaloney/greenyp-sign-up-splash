
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentSuccessBannerProps {
  onDismiss: () => void;
}

const PaymentSuccessBanner = ({ onDismiss }: PaymentSuccessBannerProps) => {
  return (
    <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <div className="flex-1">
        <AlertTitle className="text-green-800">Payment Successful!</AlertTitle>
        <AlertDescription className="text-green-700">
          Your payment has been processed successfully. Your classified ad is now active.
        </AlertDescription>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDismiss}
        className="ml-auto text-green-600 hover:text-green-800 hover:bg-green-100"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
};

export default PaymentSuccessBanner;
