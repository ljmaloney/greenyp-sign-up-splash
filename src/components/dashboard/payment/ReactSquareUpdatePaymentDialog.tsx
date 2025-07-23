
import React, { useState } from 'react';
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
import ReactSquareCard from '@/components/payment/ReactSquareCard';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAccountData } from '@/hooks/useAccountData';
import { usePaymentMethod } from '@/hooks/usePaymentMethod';

interface ReactSquareUpdatePaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReactSquareUpdatePaymentDialog = ({
  isOpen,
  onClose
}: ReactSquareUpdatePaymentDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingContact, setBillingContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const { data: accountData } = useAccountData();
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const producerId = accountData?.producer?.producerId;
  const { data: existingPaymentMethod, error: paymentMethodError } = usePaymentMethod(producerId || '');

  const handleBillingContactChange = (field: string, value: string) => {
    setBillingContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBillingAddressChange = (field: string, value: string) => {
    setBillingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentSuccess = async (tokenData: any) => {
    if (!accountData?.producer?.producerId) {
      setError('Producer ID not found. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare simplified payload for the replace endpoint
      const replacePaymentData = {
        referenceId: accountData.producer.producerId,
        paymentToken: tokenData.token,
        verificationToken: 'react-sdk-verification', // Placeholder for React SDK
        firstName: billingContact.firstName.trim(),
        lastName: billingContact.lastName.trim(),
        companyName: accountData.producer.businessName || '',
        addressLine1: billingAddress.address.trim(),
        addressLine2: '',
        city: billingAddress.city.trim(),
        state: billingAddress.state.trim(),
        postalCode: billingAddress.zipCode.trim(),
        phoneNumber: billingContact.phone.trim(),
        emailAddress: billingContact.email.trim(),
        emailValidationToken: 'AAA1234'
      };

      // Determine if we need to create a new payment method or update existing one
      const isCreatingNew = !existingPaymentMethod || (paymentMethodError?.message?.includes('404'));
      const endpoint = isCreatingNew ? '/payment/replace?createNew=true' : '/payment/replace';
      
      console.log('📤 Submitting to endpoint:', {
        endpoint,
        isCreatingNew,
        hasExistingPaymentMethod: !!existingPaymentMethod,
        paymentMethodError: paymentMethodError?.message
      });

      // Submit to the appropriate replace payment endpoint
      const replaceResponse = await apiClient.post(endpoint, replacePaymentData, { requireAuth: true });
      
      console.log('✅ Payment method updated successfully:', replaceResponse);

      toast({
        title: "Success",
        description: `Payment method ${isCreatingNew ? 'created' : 'updated'} successfully`,
        variant: "default"
      });

      onClose();

      // Invalidate and refetch payment method data
      await queryClient.invalidateQueries({
        queryKey: ['payment-method', accountData.producer.producerId]
      });

    } catch (error) {
      console.error('❌ Payment update failed:', error);
      
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to update payment method. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      title: "Payment Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const handleClose = () => {
    if (!isProcessing) {
      setBillingContact({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      });
      setBillingAddress({
        address: '',
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
          <BillingContactForm
            billingContact={billingContact}
            onChange={handleBillingContactChange}
          />
          
          <BillingAddressForm
            billingAddress={billingAddress}
            onChange={handleBillingAddressChange}
          />
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <ReactSquareCard
              billingContact={billingContact}
              billingAddress={billingAddress}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              isProcessing={isProcessing}
              buttonText="Update Payment Method"
              error={error}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReactSquareUpdatePaymentDialog;
