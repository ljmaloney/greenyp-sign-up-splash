
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BillingContactForm from '@/components/payment/BillingContactForm';
import BillingAddressForm from '@/components/payment/BillingAddressForm';
import SquareCardInput from '@/components/payment/SquareCardInput';

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
  onUpdatePayment: () => void;
  cardContainerRef: React.RefObject<HTMLDivElement>;
  squareError: string | null;
  isSquareReady: boolean;
  isSquareInitializing?: boolean;
  onSquareRetry?: () => void;
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
  isSquareInitializing = false,
  onSquareRetry
}: UpdatePaymentMethodDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
          <DialogDescription>
            Update your billing information and payment method details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <BillingContactForm
            billingContact={billingContact}
            onChange={onBillingContactChange}
          />
          
          <BillingAddressForm
            billingAddress={billingAddress}
            onChange={onBillingAddressChange}
          />
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <SquareCardInput
              cardContainerRef={cardContainerRef}
              error={squareError}
              isInitialized={isSquareReady}
              isInitializing={isSquareInitializing}
              onRetry={onSquareRetry}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={onUpdatePayment}
            disabled={isProcessing || !isSquareReady}
          >
            {isProcessing ? 'Updating...' : 'Update Payment Method'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePaymentMethodDialog;
