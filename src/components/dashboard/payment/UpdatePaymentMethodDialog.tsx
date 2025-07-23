
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BillingContactForm from '@/components/payment/BillingContactForm';
import BillingAddressForm from '@/components/payment/BillingAddressForm';

interface UpdatePaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isProcessing: boolean;
  billingContact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  onBillingContactChange: (field: string, value: string) => void;
  onBillingAddressChange: (field: string, value: string) => void;
  onUpdatePayment: (data: any) => void;
  cardContainerRef: React.RefObject<HTMLDivElement>;
  squareError: string | null;
  isSquareReady: boolean;
  isSquareInitializing: boolean;
  initializationPhase: string;
  retryCount: number;
  onSquareRetry: () => void;
}

const UpdatePaymentMethodDialog = ({
  isOpen,
  onClose,
  isProcessing,
  billingContact,
  billingAddress,
  onBillingContactChange,
  onBillingAddressChange,
  onUpdatePayment,
  cardContainerRef,
  squareError,
  isSquareReady,
  isSquareInitializing,
  retryCount,
  onSquareRetry
}: UpdatePaymentMethodDialogProps) => {
  
  const handleSubmit = () => {
    onUpdatePayment({
      token: 'mock-token',
      billingContact,
      billingAddress
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <BillingContactForm
            billingContact={billingContact}
            onChange={onBillingContactChange}
          />
          
          <BillingAddressForm
            billingAddress={billingAddress}
            onChange={onBillingAddressChange}
          />
          
          <div ref={cardContainerRef} className="border border-gray-300 rounded-lg p-4 min-h-[120px] bg-gray-50">
            {isSquareInitializing ? (
              <div className="text-center text-gray-600">Initializing payment form...</div>
            ) : isSquareReady ? (
              <div className="text-center text-gray-600">Payment form ready</div>
            ) : (
              <div className="text-center">
                <div className="text-red-600 mb-2">Payment form failed to load</div>
                <Button onClick={onSquareRetry} size="sm" variant="outline">
                  Retry ({retryCount})
                </Button>
              </div>
            )}
          </div>

          {squareError && (
            <div className="text-red-600 text-sm">{squareError}</div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isProcessing || !isSquareReady}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Update Payment Method'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePaymentMethodDialog;
