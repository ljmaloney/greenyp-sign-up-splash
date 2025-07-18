
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import SubscriptionPaymentLayout from './SubscriptionPaymentLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { findSubscriptionMatch, validateSubscriptionData } from '@/utils/subscriptionMatching';

const SignUpPaymentContainer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: subscriptions, isLoading, error: subscriptionsError } = useSubscriptions();
  
  const producerId = searchParams.get('producerId');
  const subscriptionId = searchParams.get('subscription');
  const subscriptionDataParam = searchParams.get('subscriptionData');
  const email = searchParams.get('email');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const phone = searchParams.get('phone');
  const address = searchParams.get('address');
  const city = searchParams.get('city');
  const state = searchParams.get('state');
  const postalCode = searchParams.get('postalCode');

  console.log('🔍 SignUpPaymentContainer - URL Parameters Analysis:', {
    producerId,
    subscriptionId,
    subscriptionIdLength: subscriptionId?.length,
    subscriptionIdEmpty: subscriptionId === '' || subscriptionId === null,
    email,
    firstName,
    lastName,
    phone,
    address,
    city,
    state,
    postalCode,
    hasSubscriptionData: !!subscriptionDataParam,
    subscriptionDataLength: subscriptionDataParam?.length,
    fullUrlParams: Object.fromEntries(searchParams.entries())
  });

  // Validate required parameters
  const hasRequiredData = !!(producerId && email && firstName && lastName);
  console.log('✅ SignUpPaymentContainer - Required data check:', {
    hasRequiredData,
    missingFields: {
      producerId: !producerId,
      email: !email,
      firstName: !firstName,
      lastName: !lastName
    }
  });

  // Parse the subscription data from the API response if available
  let apiSubscriptionData = null;
  if (subscriptionDataParam) {
    try {
      apiSubscriptionData = JSON.parse(subscriptionDataParam);
      console.log('✅ Parsed API subscription data:', apiSubscriptionData);
      
      const isValidApiData = validateSubscriptionData(apiSubscriptionData);
      console.log('🔍 API subscription data validation result:', {
        isValid: isValidApiData,
        data: apiSubscriptionData
      });
      
      if (!isValidApiData) {
        console.warn('⚠️ API subscription data is invalid, setting to null');
        apiSubscriptionData = null;
      }
    } catch (error) {
      console.error('❌ Failed to parse subscription data from URL:', error);
      apiSubscriptionData = null;
    }
  }

  // Redirect if essential data is missing
  useEffect(() => {
    if (!hasRequiredData) {
      console.warn('❌ Missing required signup data, redirecting to signup page');
      navigate('/subscribers/signup');
    }
  }, [hasRequiredData, navigate]);

  // Find the selected subscription using improved matching
  const selectedSubscription = findSubscriptionMatch(subscriptions, subscriptionId);
  
  console.log('🔍 Subscription matching results:', {
    subscriptionId,
    hasSelectedSubscription: !!selectedSubscription,
    selectedSubscriptionName: selectedSubscription?.displayName,
    hasApiSubscriptionData: !!apiSubscriptionData,
    apiSubscriptionName: apiSubscriptionData?.displayName || apiSubscriptionData?.subscriptionDisplayName
  });

  const customerData = {
    firstName: firstName || '',
    lastName: lastName || '',
    address: address || '',
    city: city || '',
    state: state || '',
    postalCode: postalCode || '',
    phoneNumber: phone || '',
    emailAddress: email || ''
  };

  // Don't render if essential data is missing
  if (!hasRequiredData) {
    return null;
  }

  // Show error if subscriptions failed to load
  if (subscriptionsError) {
    console.error('❌ Subscriptions loading error:', subscriptionsError);
    return (
      <div className="flex justify-center items-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load subscription data. Please try refreshing the page or contact support.
            <br />
            <small>Error: {subscriptionsError.message || 'Unknown error'}</small>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Priority: API subscription data > Reference subscription data
  const hasValidSubscriptionData = !!(apiSubscriptionData || selectedSubscription);
  
  console.log('📊 Final subscription data assessment:', {
    hasValidSubscriptionData,
    dataSource: apiSubscriptionData ? 'API' : selectedSubscription ? 'Reference' : 'None',
    willShowLoading: isLoading && !apiSubscriptionData,
    finalDecision: hasValidSubscriptionData ? 'Render payment layout' : 'Show error'
  });
  
  // Show loading only if we're waiting for reference data AND don't have API data
  if (isLoading && !apiSubscriptionData) {
    console.log('⏳ Showing loading state - waiting for subscriptions data');
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading subscription details...</div>
      </div>
    );
  }
  
  if (!hasValidSubscriptionData) {
    console.error('❌ No valid subscription data found - showing error:', {
      hasApiData: !!apiSubscriptionData,
      hasSelectedSubscription: !!selectedSubscription,
      subscriptionId,
      subscriptionIdIsEmpty: !subscriptionId || subscriptionId === '',
      availableSubscriptions: subscriptions?.map(sub => ({
        id: sub.subscriptionId,
        name: sub.displayName
      })),
      troubleshootingInfo: {
        step1: 'Check if subscriptionId parameter is being passed correctly from signup form',
        step2: 'Verify API subscription data structure matches validation requirements',
        step3: 'Ensure reference subscriptions are loaded successfully'
      }
    });
    
    return (
      <div className="flex justify-center items-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Subscription details are missing or invalid. Please return to the signup page and try again.
            <br />
            <small>Subscription ID: {subscriptionId || 'Not provided'}</small>
            <br />
            <small>Debug: API data={!!apiSubscriptionData}, Reference data={!!selectedSubscription}</small>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  console.log('✅ SignUpPaymentContainer - Rendering payment layout with valid data');

  return (
    <SubscriptionPaymentLayout 
      selectedSubscription={selectedSubscription}
      customerData={customerData}
      producerId={producerId}
      apiSubscriptionData={apiSubscriptionData}
    />
  );
};

export default SignUpPaymentContainer;
