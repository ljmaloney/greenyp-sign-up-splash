
import React from 'react';
import NewOrderSummaryCard from './NewOrderSummaryCard';
import NewAdPreviewCard from './NewAdPreviewCard';
import PaymentInformationCard from '../payment/PaymentInformationCard';
import EmailValidationCard from '../payment/EmailValidationCard';
import UnifiedSquarePaymentCard from './UnifiedSquarePaymentCard';
import { useParams } from 'react-router-dom';
import { useStableSquarePayment } from '@/hooks/useStableSquarePayment';
import { useEmailValidation } from '@/hooks/useEmailValidation';

interface ClassifiedData {
  classifiedId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  price: number;
  perUnitType: string;
  createDate: string;
  adTypeId: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  emailAddress: string;
}

interface PaymentLayoutProps {
  classified: ClassifiedData;
  customer: CustomerData;
  isSubscription?: boolean;
  producerId?: string | null;
}

const PaymentLayout = ({ classified, customer, isSubscription = false, producerId }: PaymentLayoutProps) => {
  const { classifiedId } = useParams<{ classifiedId: string }>();

  console.log('💳 PaymentLayout - Initializing with stable Square payment hook', {
    classifiedId,
    isSubscription,
    producerId,
    customerEmail: customer?.emailAddress
  });

  // Use stable Square payment hook instead of the problematic useSquarePayment
  const {
    cardContainerRef,
    payments,
    card,
    error: squareError,
    isInitialized,
    isInitializing,
    retryCount,
    setError: setSquareError,
    retryInitialization
  } = useStableSquarePayment();

  const [billingInfo, setBillingInfo] = React.useState({
    contact: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.emailAddress || '',
      phone: customer?.phoneNumber || ''
    },
    address: {
      address: customer?.address || '',
      city: customer?.city || '',
      state: customer?.state || '',
      zipCode: customer?.postalCode || ''
    },
    emailValidationToken: ''
  });

  // Enhanced email validation hook
  const {
    isValidating,
    isValidated,
    validationError,
    validateEmail,
    resetValidation
  } = useEmailValidation({
    emailAddress: customer?.emailAddress || '',
    context: 'classifieds',
    classifiedId: classifiedId
  });

  const handleBillingInfoUpdate = React.useCallback((billingInfo: any, emailToken: string) => {
    console.log('📝 PaymentLayout - Billing info updated', { billingInfo, hasToken: !!emailToken });
    setBillingInfo({ 
      contact: billingInfo.contact || billingInfo,
      address: billingInfo.address || {},
      emailValidationToken: emailToken 
    });
  }, []);

  const handleEmailValidationTokenChange = (value: string) => {
    console.log('🔑 PaymentLayout - Email validation token changed', { hasValue: !!value });
    setBillingInfo(prev => ({ ...prev, emailValidationToken: value }));
    if (!value.trim()) {
      resetValidation();
    }
  };

  const handleEmailValidation = async () => {
    console.log('✉️ PaymentLayout - Validating email', { 
      token: billingInfo.emailValidationToken,
      email: customer?.emailAddress 
    });
    await validateEmail(billingInfo.emailValidationToken);
  };

  // Log Square payment state changes
  React.useEffect(() => {
    console.log('🔄 PaymentLayout - Square payment state changed', {
      isInitialized,
      isInitializing,
      hasCard: !!card,
      hasPayments: !!payments,
      squareError,
      retryCount
    });
  }, [isInitialized, isInitializing, card, payments, squareError, retryCount]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-6">
        <NewOrderSummaryCard classified={classified} />
        <NewAdPreviewCard classified={classified} />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <EmailValidationCard
          validationToken={billingInfo.emailValidationToken}
          onChange={handleEmailValidationTokenChange}
          emailAddress={customer?.emailAddress}
          helperText="A verified email address is required before placing your classified ad"
          isValidating={isValidating}
          isValidated={isValidated}
          validationError={validationError}
          onValidate={handleEmailValidation}
        />
        
        {/* Payment Information Card - Only enabled after email validation */}
        <div className={!isValidated ? 'opacity-50 pointer-events-none' : ''}>
          <PaymentInformationCard 
            classified={classified}
            customer={customer}
            onBillingInfoChange={handleBillingInfoUpdate}
            emailValidationToken={billingInfo.emailValidationToken}
            isEmailValidated={isValidated}
          />
        </div>
        
        {/* Payment Method Card - Only enabled after email validation */}
        <div className={!isValidated ? 'opacity-50 pointer-events-none' : ''}>
          <UnifiedSquarePaymentCard
            billingContact={billingInfo.contact}
            billingAddress={billingInfo.address}
            emailValidationToken={billingInfo.emailValidationToken}
            cardContainerRef={cardContainerRef}
            payments={payments}
            card={card}
            squareError={squareError}
            setSquareError={setSquareError}
            paymentType={isSubscription ? 'subscription' : 'classified'}
            producerId={producerId || undefined}
          />
        </div>
        
        {/* Debug information in development */}
        {import.meta.env.DEV && (
          <div className="bg-gray-100 p-4 rounded text-xs">
            <div><strong>Debug Info:</strong></div>
            <div>Square Initialized: {isInitialized ? '✅' : '❌'}</div>
            <div>Square Initializing: {isInitializing ? '⏳' : '✅'}</div>
            <div>Card Ready: {card ? '✅' : '❌'}</div>
            <div>Payments Ready: {payments ? '✅' : '❌'}</div>
            <div>Email Validated: {isValidated ? '✅' : '❌'}</div>
            <div>Retry Count: {retryCount}</div>
            {squareError && <div className="text-red-600">Square Error: {squareError}</div>}
            {validationError && <div className="text-red-600">Validation Error: {validationError}</div>}
            {retryCount > 0 && (
              <button 
                onClick={retryInitialization}
                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
              >
                Retry Square Init
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentLayout;
