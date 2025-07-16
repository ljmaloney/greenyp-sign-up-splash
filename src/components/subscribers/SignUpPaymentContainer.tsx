
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

  // Find the selected subscription
  const selectedSubscription = subscriptions?.find(sub => sub.subscriptionId === subscriptionId);

  // If we don't have the subscription data yet, show loading or use fallback
  const planName = selectedSubscription?.displayName || 'GreenYP Subscription';
  const planPrice = selectedSubscription?.annualBillAmount || 99;

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

  return (
    <SubscriptionPaymentLayout 
      planName={planName}
      planPrice={planPrice}
      customerData={customerData}
      producerId={producerId}
    />
  );
};

export default SignUpPaymentContainer;
