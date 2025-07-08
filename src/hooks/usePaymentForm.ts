
import { useState } from 'react';
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

export const usePaymentForm = (classifiedId: string) => {
  const { toast } = useToast();
  const apiClient = useApiClient();

  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    cardholderName: '',
    email: '',
    phoneNumber: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [squareToken, setSquareToken] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCopyFromClassified = async () => {
    try {
      console.log('Fetching customer data for classified:', classifiedId);
      
      const response = await apiClient.get(`/classified/${classifiedId}/customer`, { requireAuth: false });
      
      console.log('Customer data response:', response);
      
      if (response?.response?.customer) {
        const customer = response.response.customer;
        
        // Construct cardholder name from first and last name
        const cardholderName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
        
        setPaymentForm(prev => ({
          ...prev,
          cardholderName: cardholderName,
          email: customer.emailAddress || '',
          phoneNumber: customer.phoneNumber || '',
          billingAddress: customer.address || '',
          city: customer.city || '',
          state: customer.state || '',
          zipCode: customer.postalCode || ''
        }));

        toast({
          title: "Information Copied",
          description: "Customer information has been copied from the classified ad.",
        });
      } else {
        throw new Error('Customer data not found');
      }
    } catch (error: any) {
      console.error('Failed to fetch customer data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load customer information. Please enter the details manually.",
        variant: "destructive"
      });
    }
  };

  const handleSquareTokenReceived = (tokenData: any) => {
    console.log('Square token received:', tokenData);
    setSquareToken(tokenData.token);
    setCardDetails(tokenData.details);
  };

  return {
    paymentForm,
    squareToken,
    cardDetails,
    isProcessingPayment,
    setIsProcessingPayment,
    handleInputChange,
    handleCopyFromClassified,
    handleSquareTokenReceived
  };
};
