
import { useToast } from '@/hooks/use-toast';
import { useApiClient } from '@/hooks/useApiClient';

interface PaymentFormData {
  cardholderName: string;
  email: string;
  phoneNumber: string;
  billingAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

export const usePaymentProcessing = () => {
  const { toast } = useToast();
  const apiClient = useApiClient();

  const processPayment = async (
    classifiedId: string,
    squareToken: string,
    paymentForm: PaymentFormData,
    onSuccess: (classifiedId: string) => void,
    setIsProcessing: (isProcessing: boolean) => void
  ) => {
    // Validate billing address
    const requiredBillingFields = ['billingAddress', 'city', 'state', 'zipCode'];
    for (const field of requiredBillingFields) {
      if (!paymentForm[field as keyof PaymentFormData]) {
        toast({
          title: "Validation Error",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`,
          variant: "destructive"
        });
        return;
      }
    }

    // Validate payment form fields
    const requiredPaymentFields = ['cardholderName', 'email', 'phoneNumber'];
    for (const field of requiredPaymentFields) {
      if (!paymentForm[field as keyof PaymentFormData]) {
        toast({
          title: "Validation Error",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`,
          variant: "destructive"
        });
        return;
      }
    }

    setIsProcessing(true);
    
    try {
      // Extract first and last name from cardholder name
      const nameParts = paymentForm.cardholderName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const paymentPayload = {
        classifiedId,
        paymentToken: squareToken,
        firstName,
        lastName,
        address: paymentForm.billingAddress,
        city: paymentForm.city,
        state: paymentForm.state,
        postalCode: paymentForm.zipCode,
        phoneNumber: paymentForm.phoneNumber,
        emailAddress: paymentForm.email
      };

      console.log('Sending payment request:', paymentPayload);

      const response = await apiClient.post('/classified/payment', paymentPayload, { requireAuth: false });
      
      console.log('Payment response:', response);

      toast({
        title: "Payment Successful!",
        description: "Your classified ad has been published successfully.",
      });

      onSuccess(classifiedId);
      
    } catch (error: any) {
      console.error('Payment processing failed:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { processPayment };
};
