
import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import OrderSummaryCard from '@/components/classifieds/OrderSummaryCard';
import AdPreviewCard from '@/components/classifieds/AdPreviewCard';
import PaymentFormCard from '@/components/classifieds/PaymentFormCard';
import BillingAddressCard from '@/components/classifieds/BillingAddressCard';
import PaymentTotalCard from '@/components/classifieds/PaymentTotalCard';

const Payment = () => {
  const { classifiedId } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  
  const classifiedData = location.state?.classifiedData;
  const packageData = location.state?.packageData;

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phoneNumber: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

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

  const handlePayment = () => {
    // TODO: Implement payment processing
    console.log('Processing payment for classified:', classifiedId);
    console.log('Payment form data:', paymentForm);
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
              <PaymentFormCard 
                paymentForm={{
                  cardNumber: paymentForm.cardNumber,
                  expiryDate: paymentForm.expiryDate,
                  cvv: paymentForm.cvv,
                  cardholderName: paymentForm.cardholderName,
                  email: paymentForm.email,
                  phoneNumber: paymentForm.phoneNumber
                }}
                onInputChange={handleInputChange}
                onCopyFromClassified={handleCopyFromClassified}
                classifiedData={classifiedData}
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
