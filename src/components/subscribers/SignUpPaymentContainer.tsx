
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import SubscriptionPaymentLayout from './SubscriptionPaymentLayout';

const SignUpPaymentContainer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: subscriptions } = useSubscriptions();
  
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

  // Redirect if essential data is missing (indicates account creation may have failed)
  useEffect(() => {
    if (!producerId || !email || !firstName || !lastName) {
      console.log('Missing required signup data, redirecting to signup page');
      navigate('/subscribers/signup');
    }
  }, [producerId, email, firstName, lastName, navigate]);

  // Find the selected subscription from the cached reference data
  const selectedSubscription = subscriptions?.find(sub => sub.subscriptionId === subscriptionId);

  console.log('SignUpPaymentContainer - Selected subscription:', selectedSubscription);
  console.log('SignUpPaymentContainer - Available subscriptions:', subscriptions);

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

  // Show loading state if subscriptions haven't loaded yet
  if (!subscriptions) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Loading subscription details...</div>
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
