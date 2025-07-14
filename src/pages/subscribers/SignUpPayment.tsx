
import React from 'react';
import SignUpHeader from '@/components/SignUpHeader';
import Footer from '@/components/Footer';
import SignUpPaymentContainer from '@/components/subscribers/SignUpPaymentContainer';

const SignUpPayment = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SignUpHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Subscription</h1>
            <p className="text-gray-600">Review your subscription details and complete payment</p>
          </div>
          <SignUpPaymentContainer />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPayment;
