
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PaymentInformationCard from '@/components/payment/PaymentInformationCard';
import ReactSquareCard from '@/components/payment/ReactSquareCard';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface UpdatePaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  producerId: string;
}

const UpdatePaymentMethodDialog = ({
  isOpen,
  onClose,
  producerId
}: UpdatePaymentMethodDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const handleBillingInfoChange = (updatedInfo: typeof billingInfo) => {
    setBillingInfo(updatedInfo);
  };

  const handlePayment = async (tokenData: any) => {
    if (!producerId) {
      setError('Producer ID not found. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Prepare payload for the replace payment endpoint
      const replacePaymentData = {
        referenceId: producerId,
        paymentToken: tokenData.token,
        verificationToken: 'square-web-payments-sdk',
        firstName: billingInfo.firstName.trim(),
        lastName: billingInfo.lastName.trim(),
        companyName: billingInfo.company?.trim() || null,
        addressLine1: billingInfo.address.trim(),
        addressLine2: billingInfo.address2?.trim() || '',
        city: billingInfo.city.trim(),
        state: billingInfo.state.trim(),
        postalCode: billingInfo.zipCode.trim(),
        phoneNumber: billingInfo.phone.trim(),
        emailAddress: billingInfo.email.trim(),
        emailValidationToken: ''
      };

      console.log('📤 Submitting payment info to /account/replace/payment:', replacePaymentData);

      // Send request to update payment method
      const response = await apiClient.post('/account/replace/payment', replacePaymentData, { requireAuth: true });
      
      console.log('✅ Payment method updated successfully:', response);

      // Show success message
      toast({
        title: "Success",
        description: "Payment method updated successfully",
        variant: "default"
      });

      // Invalidate and refetch payment method data
      await queryClient.invalidateQueries({
        queryKey: ['payment-method', producerId]
      });

      onClose();
    } catch (err: any) {
      console.error('❌ Payment update failed:', err);
      
      const errorMessage = err.message || "Failed to update payment method. Please try again.";
      setError(errorMessage);
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setBillingInfo({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        zipCode: ''
      });
      setError(null);
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
          {/* Billing Information */}
          <div>
            <h3 className="text-lg font-medium mb-2">Billing Information</h3>
            <PaymentInformationCard
              initialBillingInfo={billingInfo}
              onBillingInfoChange={handleBillingInfoChange}
              emailValidationToken=""
              isEmailValidated={true}
              copyFromAdData={null}
              showCopyButton={false}
            />
          </div>
          
          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-medium mb-2">Payment Method</h3>
            <ReactSquareCard
              billingContact={{
                firstName: billingInfo.firstName || '',
                lastName: billingInfo.lastName || '',
                email: billingInfo.email || '',
                phone: billingInfo.phone || ''
              }}
              billingAddress={{
                address: billingInfo.address || '',
                city: billingInfo.city || '',
                state: billingInfo.state || '',
                zipCode: billingInfo.zipCode || ''
              }}
              onPaymentSuccess={handlePayment}
              onPaymentError={(errorMsg) => setError(errorMsg)}
              isProcessing={isProcessing}
              buttonText="Update Payment Method"
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePaymentMethodDialog;
