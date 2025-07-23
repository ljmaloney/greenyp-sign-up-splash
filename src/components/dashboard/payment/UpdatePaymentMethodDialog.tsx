
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ReactSquareCard from '@/components/payment/ReactSquareCard';
import { useAccountData } from '@/hooks/useAccountData';
import { useUpdatePaymentMethod } from '@/hooks/useUpdatePaymentMethod';
import { toast } from '@/components/ui/sonner';

interface UpdatePaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdatePaymentMethodDialog = ({ isOpen, onClose }: UpdatePaymentMethodDialogProps) => {
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;
  const { updatePaymentMethod, isUpdating, error, resetError } = useUpdatePaymentMethod(producerId || '');

  const [billingInfo, setBillingInfo] = React.useState({
    contact: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    address: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const handlePaymentSuccess = async (result: any) => {
    try {
      await updatePaymentMethod({
        token: result.token,
        billingContact: billingInfo.contact,
        billingAddress: billingInfo.address
      });
      
      toast.success('Payment method updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update payment method');
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    toast.error(errorMessage);
  };

  React.useEffect(() => {
    if (!isOpen) {
      resetError();
    }
  }, [isOpen, resetError]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <ReactSquareCard
            billingContact={billingInfo.contact}
            billingAddress={billingInfo.address}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            isProcessing={isUpdating}
            buttonText="Update Payment Method"
            error={error}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePaymentMethodDialog;
