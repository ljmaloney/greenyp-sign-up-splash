
import React from 'react';
import { useSignUpPaymentParams } from '@/hooks/useSignUpPaymentParams';
import { useSubscriptionDataProcessor } from '@/hooks/useSubscriptionDataProcessor';
import SubscriptionPaymentLayout from './SubscriptionPaymentLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  console.log('🔍 SignUpPaymentContainer - Enhanced state logging:', {
    urlValidation: {
      hasRequiredData,
      validationErrors,
      isValidating
    },
    subscriptionProcessing: {
      hasValidSubscriptionData,
      dataSource,
      processingError,
      hasApiData: !!apiSubscriptionData,
      hasReferenceData: !!selectedSubscription
    },
    params: {
      producerId: params.producerId,
      email: params.email,
      subscriptionId: params.subscriptionId,
      hasSubscriptionData: !!params.subscriptionDataParam
    }
  });

  // Show loading state while validating URL parameters
  if (isValidating) {
    console.log('⏳ Showing enhanced URL validation loading state');
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Validating payment information...</span>
        </div>
      </div>
    );
  }

  // Show URL validation errors (these will auto-redirect)
  if (!hasRequiredData) {
    console.log('❌ URL validation failed, showing enhanced error while redirecting');
    return (
      <div className="flex justify-center items-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <div>Required payment information is missing. Redirecting to signup page...</div>
              <div className="text-sm">
                <strong>Missing:</strong> {validationErrors.join(', ')}
              </div>
              <Button 
                onClick={() => window.location.href = '/subscribers/signup'}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Go to Signup Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show subscription processing error with retry option
  if (processingError) {
    console.error('❌ Subscription processing error:', processingError);
    return (
      <div className="flex justify-center items-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <div>{processingError}</div>
              <div className="text-sm">
                This might be a temporary issue. You can try refreshing the page or return to signup.
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button 
                  onClick={() => window.location.href = '/subscribers/signup'}
                  variant="default"
                  size="sm"
                  className="flex-1"
                >
                  Back to Signup
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading for subscription data (only if we're still processing and have no data)
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

  console.log('✅ SignUpPaymentContainer - Rendering enhanced payment layout:', {
    dataSource,
    hasApiData: !!apiSubscriptionData,
    hasReferenceData: !!selectedSubscription,
    customerDataComplete: !!(customerData.firstName && customerData.lastName && customerData.emailAddress)
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
