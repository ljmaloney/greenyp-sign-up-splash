
import { useState } from 'react';
import { useAccountData } from './useAccountData';
import { useApiClient } from './useApiClient';
import { useStableSquarePayment } from './useStableSquarePayment';
import { processSquarePayment } from '@/utils/squarePaymentProcessor';
import { useToast } from '@/hooks/use-toast';

interface BillingContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BillingAddressData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export const useUpdatePaymentMethod = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingContact, setBillingContact] = useState<BillingContactData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [billingAddress, setBillingAddress] = useState<BillingAddressData>({
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const { data: accountData } = useAccountData();
  const apiClient = useApiClient();
  const { toast } = useToast();
  const {
    cardContainerRef,
    payments,
    card,
    error: squareError,
    isInitialized,
    setError
  } = useStableSquarePayment();

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    // Reset form data when closing
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
  };

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

  const validateForm = (): boolean => {
    if (!billingContact.firstName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name is required",
        variant: "destructive"
      });
      return false;
    }

    if (!billingContact.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "Last name is required",
        variant: "destructive"
      });
      return false;
    }

    if (!billingContact.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      });
      return false;
    }

    if (!billingAddress.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Address is required",
        variant: "destructive"
      });
      return false;
    }

    if (!billingAddress.city.trim()) {
      toast({
        title: "Validation Error",
        description: "City is required",
        variant: "destructive"
      });
      return false;
    }

    if (!billingAddress.state.trim()) {
      toast({
        title: "Validation Error",
        description: "State is required",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleUpdatePayment = async () => {
    console.log('💳 Starting payment method update...');

    if (!validateForm()) {
      return;
    }

    if (!card || !payments) {
      toast({
        title: "Payment Error",
        description: "Payment form is not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (!accountData?.producer?.producerId) {
      toast({
        title: "Error",
        description: "Producer ID not found. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Process payment using the existing Square payment processor
      const paymentResponse = await processSquarePayment(
        card,
        payments,
        billingContact,
        billingAddress,
        accountData.producer.producerId,
        apiClient,
        'AAA1234' // Default email validation token as specified
      );

      console.log('✅ Payment processed successfully:', paymentResponse);

      // Prepare simplified payload for the replace endpoint
      const replacePaymentData = {
        referenceId: accountData.producer.producerId,
        paymentToken: paymentResponse.paymentToken || paymentResponse.token,
        verificationToken: paymentResponse.verificationToken,
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

      console.log('📤 Submitting to replace endpoint:', replacePaymentData);

      // Submit to the replace payment endpoint
      const replaceResponse = await apiClient.post('/payment/replace', replacePaymentData, { requireAuth: true });
      
      console.log('✅ Payment method updated successfully:', replaceResponse);

      toast({
        title: "Success",
        description: "Payment method updated successfully",
        variant: "default"
      });

      closeDialog();

      // Optionally refresh the payment method data
      // This would require access to the query client or a refetch function

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

  return {
    isDialogOpen,
    isProcessing,
    billingContact,
    billingAddress,
    squareError,
    isInitialized,
    cardContainerRef,
    openDialog,
    closeDialog,
    handleBillingContactChange,
    handleBillingAddressChange,
    handleUpdatePayment
  };
};
