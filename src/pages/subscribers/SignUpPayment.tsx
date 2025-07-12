
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SignUpHeader from '@/components/SignUpHeader';
import Footer from '@/components/Footer';
import PaymentInformationCard from '@/components/classifieds/PaymentInformationCard';
import EmailValidationCard from '@/components/classifieds/EmailValidationCard';
import SquarePaymentCard from '@/components/subscribers/SquareSignUpPaymentCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SignUpPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const producerId = searchParams.get('producerId');
  const subscription = searchParams.get('subscription');
  const email = searchParams.get('email');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const phone = searchParams.get('phone');
  const address = searchParams.get('address');
  const city = searchParams.get('city');
  const state = searchParams.get('state');
  const postalCode = searchParams.get('postalCode');

  const [billingInfo, setBillingInfo] = useState({
    contact: {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      phone: phone || ''
    },
    address: {
      address: address || '',
      city: city || '',
      state: state || '',
      zipCode: postalCode || ''
    },
    emailValidationToken: ''
  });

  useEffect(() => {
    // Redirect if essential data is missing
    if (!producerId || !email) {
      console.error('Missing required signup data, redirecting to signup');
      navigate('/subscribers/signup');
    }
  }, [producerId, email, navigate]);

  const handleBillingInfoUpdate = React.useCallback((contact: any, address: any, emailValidationToken: string) => {
    setBillingInfo({ contact, address, emailValidationToken });
  }, []);

  const handleEmailValidationTokenChange = (value: string) => {
    setBillingInfo(prev => ({ ...prev, emailValidationToken: value }));
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

  if (!producerId || !email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SignUpHeader />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Subscription</h1>
            <p className="text-gray-600">Complete your payment information to activate your GreenYP subscription</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Account Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Account Email:</span>
                    <span>{email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Business Contact:</span>
                    <span>{firstName} {lastName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Location:</span>
                    <span>{city}, {state} {postalCode}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Subscription:</span>
                    <span className="text-green-600 font-semibold">Ready to Activate</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Payment Information */}
            <div className="space-y-6">
              <PaymentInformationCard 
                customer={customerData}
                onBillingInfoChange={handleBillingInfoUpdate}
              />
              <EmailValidationCard
                emailValidationToken={billingInfo.emailValidationToken}
                onChange={handleEmailValidationTokenChange}
              />
              <SquarePaymentCard
                producerId={producerId}
                billingContact={billingInfo.contact}
                billingAddress={billingInfo.address}
                emailValidationToken={billingInfo.emailValidationToken}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPayment;
