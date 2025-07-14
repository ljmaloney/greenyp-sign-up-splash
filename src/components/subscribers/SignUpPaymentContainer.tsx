
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import SubscriptionPaymentLayout from './SubscriptionPaymentLayout';

const SignUpPaymentContainer = () => {
  const [searchParams] = useSearchParams();
  
  const producerId = searchParams.get('producerId');
  const email = searchParams.get('email');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const phone = searchParams.get('phone');
  const address = searchParams.get('address');
  const city = searchParams.get('city');
  const state = searchParams.get('state');
  const postalCode = searchParams.get('postalCode');

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

  return (
    <SubscriptionPaymentLayout 
      planName="GreenYP Subscription"
      planPrice={99}
      customerData={customerData}
      producerId={producerId}
    />
  );
};

export default SignUpPaymentContainer;
