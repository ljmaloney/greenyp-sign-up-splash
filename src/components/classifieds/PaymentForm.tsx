
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useApiClient } from '@/hooks/useApiClient';
import { SquareCardData } from '@/hooks/useSquarePayments';
import SquareCardForm from './SquareCardForm';
import BillingAddressCard from './BillingAddressCard';
import PaymentTotalCard from './PaymentTotalCard';

interface PaymentFormProps {
  classifiedId: string;
  classifiedData: any;
  packageData: any;
  onPaymentSuccess: (classifiedId: string) => void;
}

const PaymentForm = ({ classifiedId, classifiedData, packageData, onPaymentSuccess }: PaymentFormProps) => {
  const { toast } = useToast();
  const apiClient = useApiClient();

  const [paymentForm, setPaymentForm] = useState({
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

  const handleSquareTokenReceived = (tokenData: SquareCardData) => {
    console.log('Square token received:', tokenData);
    setSquareToken(tokenData.token);
    setCardDetails(tokenData.details);
  };

  const handlePayment = async () => {
    if (!squareToken) {
      toast({
        title: "Payment Error",
        description: "Please validate your payment information first",
        variant: "destructive"
      });
      return;
    }

    // Validate billing address
    const requiredBillingFields = ['billingAddress', 'city', 'state', 'zipCode'];
    for (const field of requiredBillingFields) {
      if (!paymentForm[field as keyof typeof paymentForm]) {
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
      if (!paymentForm[field as keyof typeof paymentForm]) {
        toast({
          title: "Validation Error",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`,
          variant: "destructive"
        });
        return;
      }
    }

    setIsProcessingPayment(true);
    
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

      onPaymentSuccess(classifiedId);
      
    } catch (error: any) {
      console.error('Payment processing failed:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      <BillingAddressCard 
        paymentForm={{
          billingAddress: paymentForm.billingAddress,
          city: paymentForm.city,
          state: paymentForm.state,
          zipCode: paymentForm.zipCode
        }}
        onInputChange={handleInputChange}
        isProcessing={isProcessingPayment}
        onCopyFromClassified={handleCopyFromClassified}
        classifiedData={classifiedData}
      />

      <SquareCardForm 
        billingInfo={{
          cardholderName: paymentForm.cardholderName,
          email: paymentForm.email,
          phoneNumber: paymentForm.phoneNumber
        }}
        onInputChange={handleInputChange}
        onTokenReceived={handleSquareTokenReceived}
        isProcessing={isProcessingPayment}
      />

      <PaymentTotalCard 
        packageData={packageData}
        onPayment={handlePayment}
        hasValidPayment={!!squareToken}
        paymentToken={squareToken || undefined}
        isProcessing={isProcessingPayment}
      />
    </div>
  );
};

export default PaymentForm;
