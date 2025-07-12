
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentLayout from '@/components/classifieds/PaymentLayout';

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

  // Create mock classified data for the subscription
  const mockClassified = {
    classifiedId: 'subscription',
    title: 'GreenYP Subscription',
    description: 'Annual subscription to GreenYP business directory services',
    address: address || '',
    city: city || '',
    state: state || '',
    postalCode: postalCode || '',
    price: 99, // Annual subscription price
    perUnitType: 'year',
    createDate: new Date().toISOString(),
    adTypeId: 'subscription'
  };

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
    <PaymentLayout 
      classified={mockClassified}
      customer={customerData}
      isSubscription={true}
      producerId={producerId}
    />
  );
};

export default SignUpPaymentContainer;
