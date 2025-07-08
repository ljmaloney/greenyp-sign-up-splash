
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

  const handleCopyFromClassified = () => {
    if (classifiedData) {
      setPaymentForm(prev => ({
        ...prev,
        cardholderName: `${classifiedData.firstName || ''} ${classifiedData.lastName || ''}`.trim(),
        email: classifiedData.emailAddress || '',
        phoneNumber: classifiedData.phoneNumber || '',
        billingAddress: classifiedData.address || '',
        city: classifiedData.city || '',
        state: classifiedData.state || '',
        zipCode: classifiedData.postalCode || ''
      }));

      toast({
        title: "Information Copied",
        description: "Contact and billing address information has been copied from your ad details.",
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
      <SquareCardForm 
        billingInfo={{
          cardholderName: paymentForm.cardholderName,
          email: paymentForm.email,
          phoneNumber: paymentForm.phoneNumber
        }}
        onInputChange={handleInputChange}
        onTokenReceived={handleSquareTokenReceived}
        onCopyFromClassified={handleCopyFromClassified}
        classifiedData={classifiedData}
        isProcessing={isProcessingPayment}
      />

      <BillingAddressCard 
        paymentForm={{
          billingAddress: paymentForm.billingAddress,
          city: paymentForm.city,
          state: paymentForm.state,
          zipCode: paymentForm.zipCode
        }}
        onInputChange={handleInputChange}
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
