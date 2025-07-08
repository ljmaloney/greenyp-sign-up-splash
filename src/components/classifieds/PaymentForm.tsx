
import React from 'react';
import { usePaymentForm } from '@/hooks/usePaymentForm';
import { usePaymentProcessing } from '@/hooks/usePaymentProcessing';
import { useToast } from '@/hooks/use-toast';
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
  const { processPayment } = usePaymentProcessing();
  
  const {
    paymentForm,
    squareToken,
    isProcessingPayment,
    setIsProcessingPayment,
    handleInputChange,
    handleCopyFromClassified,
    handleSquareTokenReceived
  } = usePaymentForm(classifiedId);

  const handlePayment = async () => {
    if (!squareToken) {
      toast({
        title: "Payment Error",
        description: "Please validate your payment information first",
        variant: "destructive"
      });
      return;
    }

    await processPayment(
      classifiedId,
      squareToken,
      paymentForm,
      onPaymentSuccess,
      setIsProcessingPayment
    );
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
