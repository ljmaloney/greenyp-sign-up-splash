
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import SubscriptionPaymentLayout from './SubscriptionPaymentLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const SignUpPaymentContainer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: subscriptions, isLoading, error: subscriptionsError } = useSubscriptions();
  
  const producerId = searchParams.get('producerId');
  const subscriptionId = searchParams.get('subscription');
  const email = searchParams.get('email');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const phone = searchParams.get('phone');
  const address = searchParams.get('address');
  const city = searchParams.get('city');
  const state = searchParams.get('state');
  const postalCode = searchParams.get('postalCode');

  console.log('SignUpPaymentContainer - URL Parameters:', {
    producerId,
    subscriptionId,
    email,
    firstName,
    lastName,
    phone,
    address,
    city,
    state,
    postalCode
  });

  console.log('SignUpPaymentContainer - Subscriptions loading state:', {
    isLoading,
    subscriptionsError,
    subscriptionsCount: subscriptions?.length,
    subscriptions
  });

  // Redirect if essential data is missing (indicates account creation may have failed)
  useEffect(() => {
    if (!producerId || !email || !firstName || !lastName) {
      console.log('Missing required signup data, redirecting to signup page');
      navigate('/subscribers/signup');
    }
  }, [producerId, email, firstName, lastName, navigate]);

  // Find the selected subscription from the cached reference data
  const selectedSubscription = subscriptions?.find(sub => {
    console.log('Comparing subscription:', sub.subscriptionId, 'with URL param:', subscriptionId);
    return sub.subscriptionId === subscriptionId;
  });

  console.log('SignUpPaymentContainer - Selected subscription:', selectedSubscription);

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
  if (!producerId || !email || !firstName || !lastName) {
    return null;
  }

  // Show error if subscriptions failed to load
  if (subscriptionsError) {
    console.error('Subscriptions loading error:', subscriptionsError);
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

  // Show loading state if subscriptions haven't loaded yet
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading subscription details...</div>
      </div>
    );
  }

  // Show warning if subscription not found but continue with fallback
  if (!selectedSubscription && subscriptionId) {
    console.warn('Selected subscription not found:', {
      searchedId: subscriptionId,
      availableSubscriptions: subscriptions?.map(sub => ({
        id: sub.subscriptionId,
        name: sub.displayName
      }))
    });
    
    return (
      <div className="flex justify-center items-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The selected subscription plan could not be found. Please return to the signup page and select a plan.
            <br />
            <small>Subscription ID: {subscriptionId}</small>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <SubscriptionPaymentLayout 
      selectedSubscription={selectedSubscription}
      customerData={customerData}
      producerId={producerId}
    />
  );
};

export default SignUpPaymentContainer;
