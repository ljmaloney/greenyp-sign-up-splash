
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import UpdatePaymentForm from './UpdatePaymentForm';
import { useAccountData } from '@/hooks/useAccountData';
import { useToast } from '@/hooks/use-toast';

interface UpdatePaymentDialogProps {
  open: boolean;
  onClose: () => void;
}

const UpdatePaymentDialog = ({ open, onClose }: UpdatePaymentDialogProps) => {
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    toast({
      title: "Payment Method Updated",
      description: "Your payment method has been successfully updated."
    });
    onClose();
  };
  
  const handleError = () => {
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && !isSubmitting) onClose();
    }}>
      <DialogContent className="max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
        </DialogHeader>
        
        <UpdatePaymentForm 
          producerId={producerId}
          onSuccess={handleSuccess}
          onError={handleError}
          onCancel={onClose}
          setIsSubmitting={setIsSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePaymentDialog;
