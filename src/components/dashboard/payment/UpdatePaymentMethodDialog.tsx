
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
  // Improved button state logic
  const isSquareLoading = isSquareInitializing || (!isSquareReady && !squareError);
  const canSubmit = isSquareReady && !isProcessing && !isSquareLoading;

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
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
            
            {/* Additional status information */}
            {isSquareLoading && (
              <div className="mt-2 text-xs text-gray-500">
                ⏳ Setting up secure payment form...
              </div>
            )}
            {isSquareReady && (
              <div className="mt-2 text-xs text-green-600">
                ✅ Payment form ready for input
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {isSquareLoading && "Preparing payment form..."}
            {squareError && "Please resolve payment form issues to continue"}
            {isSquareReady && "Ready to process payment"}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={onUpdatePayment}
              disabled={!canSubmit}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Payment Method'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePaymentMethodDialog;
