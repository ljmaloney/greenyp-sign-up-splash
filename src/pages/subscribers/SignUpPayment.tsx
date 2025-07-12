
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SignUpHeader from '@/components/SignUpHeader';
import Footer from '@/components/Footer';
import SignUpPaymentContainer from '@/components/subscribers/SignUpPaymentContainer';

const SignUpPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const producerId = searchParams.get('producerId');
  const email = searchParams.get('email');

  useEffect(() => {
    // Redirect if essential data is missing
    if (!producerId || !email) {
      console.error('Missing required signup data, redirecting to signup');
      navigate('/subscribers/signup');
    }
  }, [producerId, email, navigate]);

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
          
          <SignUpPaymentContainer />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPayment;
