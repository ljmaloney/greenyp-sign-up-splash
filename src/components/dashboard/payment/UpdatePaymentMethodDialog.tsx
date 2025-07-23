
import React from 'react';
import { RefreshCw } from 'lucide-react';
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
  initializationPhase?: string;
  retryCount?: number;
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
  initializationPhase = 'idle',
  retryCount = 0,
  onSquareRetry
}: UpdatePaymentMethodDialogProps) => {
  // Improved button state logic
  const isSquareLoading = isSquareInitializing || (!isSquareReady && !squareError);
  const canSubmit = isSquareReady && !isProcessing && !isSquareLoading;

  const handleClose = () => {
    if (!isProcessing && !isSquareInitializing) {
      onClose();
    }
  };

  const getStatusMessage = () => {
    if (isProcessing) return "Processing payment update...";
    if (squareError) return "Please resolve payment form issues to continue";
    if (isSquareLoading) return "Preparing secure payment form...";
    if (isSquareReady) return "Ready to process payment update";
    return "Loading...";
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
              initializationPhase={initializationPhase}
              retryCount={retryCount}
              onRetry={onSquareRetry}
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-xs text-gray-500 max-w-xs">
            {getStatusMessage()}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing || isSquareInitializing}
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
