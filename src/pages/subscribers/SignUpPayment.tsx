
import React from 'react';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import SignUpPaymentContainer from '@/components/subscribers/SignUpPaymentContainer';

const SignUpPayment = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Subscription</h1>
            <p className="text-gray-600">Finalize your payment and subscription details</p>
          </div>

          <SignUpPaymentContainer />
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default SignUpPayment;
