
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';
import { useToast } from '@/hooks/use-toast';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import NewOrderSummaryCard from '@/components/classifieds/NewOrderSummaryCard';
import ClassifiedCard from '@/components/classifieds/ClassifiedCard';
import EmailValidationCard from '@/components/payment/EmailValidationCard';
import PaymentInformationCard from '@/components/payment/PaymentInformationCard';
import ReactSquareCard from '@/components/payment/ReactSquareCard';
import { validatePaymentFields } from '@/utils/paymentValidation';
import { formatPhoneForSquareAPI } from '@/utils/phoneUtils';
import { Classified } from '@/types/classifieds';
import { ClassifiedPaymentData, PaymentProcessResponse } from '@/types/classifiedPayment';

const Payment = () => {
  const { classifiedId } = useParams<{ classifiedId: string }>();
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const { toast } = useToast();

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

  const [emailValidationToken, setEmailValidationToken] = useState('');

  // Enhanced email validation hook
  const {
    isValidating,
    isValidated,
    validationError,
    validateEmail,
    resetValidation
  } = useEmailValidation({
    emailAddress: billingContact.email,
    context: 'classifieds',
    classifiedId: classifiedId
  });

  // Fetch classified categories
  const { data: categoriesData } = useClassifiedCategories();

  // Fetch classified data
  const { data: classifiedData, isLoading, error } = useQuery({
    queryKey: ['classified-payment', classifiedId],
    queryFn: async (): Promise<ClassifiedPaymentData> => {
      console.log('Fetching classified data for payment:', classifiedId);
      const response = await apiClient.get(`/classified/${classifiedId}/customer`, { requireAuth: false });
      
      // Type assertion to properly handle the response
      const apiResponse = response as { response: ClassifiedPaymentData };
      return apiResponse.response;
    },
    enabled: !!classifiedId && classifiedId !== ':classifiedId'
  });

  // Transform classified data for ClassifiedCard
  const transformedClassified: Classified | null = classifiedData?.classified ? {
    id: classifiedData.classified.classifiedId,
    title: classifiedData.classified.title,
    description: classifiedData.classified.description,
    category: (() => {
      // Find the actual category name from the categories API
      const categoryMatch = categoriesData?.response?.find(
        cat => cat.categoryId === classifiedData.classified.categoryId
      );
      return categoryMatch?.name || 'General';
    })(),
    price: classifiedData.classified.price,
    perUnitType: classifiedData.classified.perUnitType,
    city: classifiedData.classified.city,
    state: classifiedData.classified.state,
    zipCode: classifiedData.classified.postalCode,
    email: classifiedData.customer?.emailAddress || '',
    phone: classifiedData.customer?.phoneNumber || '',
    images: [],
    createdAt: classifiedData.classified.createDate,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    contactObfuscated: false,
    pricingTier: classifiedData.classified.adTypeId || '1'
  } : null;

  const handleEmailValidationTokenChange = (value: string) => {
    console.log('🔑 Email validation token changed:', { hasValue: !!value });
    setEmailValidationToken(value);
    if (!value.trim()) {
      resetValidation();
    }
  };

  const handleEmailValidation = async () => {
    console.log('✉️ Validating email with token:', emailValidationToken);
    await validateEmail(emailValidationToken);
  };

  const handleBillingInfoChange = (contact: any, address: any, emailToken: string) => {
    console.log('📝 Billing info updated:', { contact, address, hasToken: !!emailToken });
    setBillingContact(contact);
    setBillingAddress(address);
  };

  const handlePaymentSuccess = async (tokenData: any) => {
    if (!classifiedId) {
      toast({
        title: "Error",
        description: "Missing classified ID",
        variant: "destructive",
      });
      return;
    }

    // Validate all required fields
    const validationError = validatePaymentFields(billingContact, billingAddress);
    if (validationError) {
      toast({
        title: "Required Information Missing",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    if (!emailValidationToken.trim()) {
      toast({
        title: "Email Validation Required",
        description: "Please validate your email address first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Format phone number specifically for Square API
      const formattedPhone = formatPhoneForSquareAPI(billingContact.phone);
      
      console.log('📞 Phone number formatting:', {
        original: billingContact.phone,
        formatted: formattedPhone
      });

      if (!formattedPhone) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid US phone number",
          variant: "destructive",
        });
        return;
      }

      // Prepare the payment payload with correct field mapping for the API
      const paymentPayload = {
        referenceId: classifiedId,
        paymentToken: tokenData.token,
        // Only include verificationToken if we have a valid one that's different from paymentToken
        ...(tokenData.verificationToken && tokenData.verificationToken !== tokenData.token 
          ? { verificationToken: tokenData.verificationToken }
          : {}),
        emailValidationToken: emailValidationToken,
        // Map billing fields to the expected API field names
        firstName: billingContact.firstName,
        lastName: billingContact.lastName,
        emailAddress: billingContact.email,
        phoneNumber: formattedPhone, // Use the properly formatted phone number
        addressLine1: billingAddress.address,
        city: billingAddress.city,
        state: billingAddress.state,
        postalCode: billingAddress.zipCode,
        cardDetails: tokenData.details,
        amount: classifiedData?.classified?.price || 0,
        currency: 'USD'
      };

      console.log('💳 Payment payload being sent:', {
        referenceId: paymentPayload.referenceId,
        hasPaymentToken: !!paymentPayload.paymentToken,
        paymentTokenLength: paymentPayload.paymentToken?.length,
        hasVerificationToken: !!(paymentPayload as any).verificationToken,
        verificationTokenLength: (paymentPayload as any).verificationToken?.length,
        verificationTokenStart: (paymentPayload as any).verificationToken?.substring(0, 10) + '...',
        hasEmailValidationToken: !!paymentPayload.emailValidationToken,
        emailValidationTokenLength: paymentPayload.emailValidationToken?.length,
        // Log the specific fields that were failing
        firstName: paymentPayload.firstName,
        lastName: paymentPayload.lastName,
        emailAddress: paymentPayload.emailAddress,
        phoneNumber: paymentPayload.phoneNumber,
        addressLine1: paymentPayload.addressLine1,
        city: paymentPayload.city,
        state: paymentPayload.state,
        postalCode: paymentPayload.postalCode,
        amount: paymentPayload.amount,
        currency: paymentPayload.currency
      });

      console.log('💳 Full payment payload:', paymentPayload);

      // Submit payment
      const paymentResponse = await apiClient.post('/classified/payment', paymentPayload, { requireAuth: false });
      
      console.log('✅ Payment response received:', paymentResponse);

      // Check response body for error fields and payment status
      const responseBody = paymentResponse.response as PaymentProcessResponse;
      const paymentStatus = responseBody?.paymentStatus;
      const errorStatusCode = responseBody?.errorStatusCode;
      const errorDetail = responseBody?.errorDetail;

      console.log('💳 Payment status check:', {
        paymentStatus,
        errorStatusCode,
        errorDetail,
        hasError: !!errorStatusCode || !!errorDetail
      });

      // Check if payment failed
      if (paymentStatus === 'PAYMENT_ERROR' || errorStatusCode || errorDetail) {
        console.error('❌ Payment failed with error:', {
          paymentStatus,
          errorStatusCode,
          errorDetail
        });

        const errorMessage = errorDetail || `Payment failed with status: ${paymentStatus}`;
        
        toast({
          title: "Payment Failed",
          description: errorMessage,
          variant: "destructive",
        });

        // Navigate to error page instead of confirmation
        navigate(`/classifieds/payment/error/${classifiedId}?error=${encodeURIComponent(errorMessage)}&errorCode=${errorStatusCode || 'PAYMENT_ERROR'}`);
        return;
      }

      // Payment successful - proceed to confirmation
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });

      // Navigate to confirmation page
      navigate(`/classifieds/payment/confirmation/${classifiedId}?paymentSuccess=true`);
      
    } catch (error) {
      console.error('❌ Payment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Navigate to error page on exception
      navigate(`/classifieds/payment/error/${classifiedId}?error=${encodeURIComponent(errorMessage)}&errorCode=EXCEPTION`);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    toast({
      title: "Payment Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading payment form...</p>
              </div>
            </div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  if (error || !classifiedData) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Payment Form</h2>
              <p className="text-gray-600">Unable to load classified information. Please try again.</p>
            </div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600">Review your ad details and complete payment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <NewOrderSummaryCard classified={classifiedData.classified} />
              {transformedClassified && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Ad Preview</h3>
                  <ClassifiedCard classified={transformedClassified} />
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <EmailValidationCard
                validationToken={emailValidationToken}
                onChange={handleEmailValidationTokenChange}
                emailAddress={classifiedData.customer?.emailAddress}
                helperText="Please validate your email address to continue with payment"
                isValidating={isValidating}
                isValidated={isValidated}
                validationError={validationError}
                onValidate={handleEmailValidation}
              />

              {/* Payment Information - Only enabled after email validation, NO payment button */}
              <div className={!isValidated ? 'opacity-50 pointer-events-none' : ''}>
                <PaymentInformationCard
                  classified={classifiedData.classified}
                  customer={classifiedData.customer}
                  onBillingInfoChange={handleBillingInfoChange}
                  emailValidationToken={emailValidationToken}
                  isEmailValidated={isValidated}
                  showPaymentButton={false}
                />
              </div>

              {/* Payment Method - Only enabled after email validation, THIS IS THE ONLY PAYMENT BUTTON */}
              <div className={!isValidated ? 'opacity-50 pointer-events-none' : ''}>
                <ReactSquareCard
                  billingContact={billingContact}
                  billingAddress={billingAddress}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  disabled={!isValidated || !emailValidationToken.trim()}
                  buttonText="Pay"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default Payment;
