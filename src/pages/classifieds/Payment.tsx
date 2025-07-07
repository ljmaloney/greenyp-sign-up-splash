
import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import OrderSummaryCard from '@/components/classifieds/OrderSummaryCard';
import AdPreviewCard from '@/components/classifieds/AdPreviewCard';
import SquareCardForm from '@/components/classifieds/SquareCardForm';
import BillingAddressCard from '@/components/classifieds/BillingAddressCard';
import PaymentTotalCard from '@/components/classifieds/PaymentTotalCard';
import { SquareCardData } from '@/hooks/useSquarePayments';

const Payment = () => {
  const { classifiedId } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  
  const classifiedData = location.state?.classifiedData;
  const packageData = location.state?.packageData;

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
        description: "Contact and address information has been copied from your ad details.",
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

    setIsProcessingPayment(true);
    
    try {
      console.log('Processing payment for classified:', classifiedId);
      console.log('Payment token:', squareToken);
      console.log('Card details:', cardDetails);
      console.log('Billing info:', paymentForm);
      console.log('Package data:', packageData);

      // TODO: Send payment to backend
      const paymentPayload = {
        classifiedId,
        paymentToken: squareToken,
        amount: packageData?.monthlyPrice || 0,
        billingInfo: paymentForm,
        cardDetails: cardDetails,
        packageInfo: packageData
      };

      console.log('Payment payload to send to backend:', paymentPayload);

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Payment Successful!",
        description: "Your classified ad has been published successfully.",
      });

      // TODO: Redirect to success page or classified detail
      
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
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600">Review your ad details and complete payment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Summary and Ad Preview */}
            <div className="space-y-6">
              <OrderSummaryCard packageData={packageData} />
              <AdPreviewCard 
                classifiedId={classifiedId || ''} 
                classifiedData={classifiedData} 
                packageData={packageData} 
              />
            </div>

            {/* Right Column - Payment Form */}
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
          </div>
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default Payment;
