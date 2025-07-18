
import React from 'react';
import { useSignUpPaymentParams } from '@/hooks/useSignUpPaymentParams';
import { useSubscriptionDataProcessor } from '@/hooks/useSubscriptionDataProcessor';
import SubscriptionPaymentLayout from './SubscriptionPaymentLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

const SignUpPaymentContainer = () => {
  const {
    params,
    hasRequiredData,
    validationErrors,
    isValidating
  } = useSignUpPaymentParams();

  const {
    selectedSubscription,
    apiSubscriptionData,
    hasValidSubscriptionData,
    dataSource,
    processingError
  } = useSubscriptionDataProcessor({
    subscriptionId: params.subscriptionId,
    subscriptionDataParam: params.subscriptionDataParam
  });

  console.log('🔍 SignUpPaymentContainer - Current state:', {
    hasRequiredData,
    validationErrors,
    isValidating,
    hasValidSubscriptionData,
    dataSource,
    processingError,
    params
  });

  // Show loading state while validating URL parameters
  if (isValidating) {
    console.log('⏳ Showing URL validation loading state');
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Validating payment information...</span>
        </div>
      </div>
    );
  }

  // Don't render if URL validation failed (redirect will happen automatically)
  if (!hasRequiredData) {
    console.log('❌ URL validation failed, showing error while redirecting');
    return (
      <div className="flex justify-center items-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Required payment information is missing. Redirecting to signup page...
            <br />
            <small>Missing: {validationErrors.join(', ')}</small>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show subscription processing error
  if (processingError) {
    console.error('❌ Subscription processing error:', processingError);
    return (
      <div className="flex justify-center items-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {processingError}
            <br />
            <small>Please return to the signup page and try again.</small>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading for subscription data (only if we don't have API data and subscriptions are still loading)
  if (!hasValidSubscriptionData && dataSource === 'None') {
    console.log('⏳ Showing subscription data loading state');
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading subscription details...</span>
        </div>
      </div>
    );
  }

  const customerData = {
    firstName: params.firstName || '',
    lastName: params.lastName || '',
    address: params.address || '',
    city: params.city || '',
    state: params.state || '',
    postalCode: params.postalCode || '',
    phoneNumber: params.phone || '',
    emailAddress: params.email || ''
  };

  console.log('✅ SignUpPaymentContainer - Rendering payment layout with valid data:', {
    dataSource,
    hasApiData: !!apiSubscriptionData,
    hasReferenceData: !!selectedSubscription
  });

  return (
    <SubscriptionPaymentLayout 
      selectedSubscription={selectedSubscription}
      customerData={customerData}
      producerId={params.producerId}
      apiSubscriptionData={apiSubscriptionData}
    />
  );
};

export default SignUpPaymentContainer;
