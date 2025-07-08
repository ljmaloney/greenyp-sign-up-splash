
import React from 'react';
import { useParams } from 'react-router-dom';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import NewPaymentContainer from '@/components/classifieds/NewPaymentContainer';

const Payment = () => {
  const { classifiedId } = useParams<{ classifiedId: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600">Review your ad details and complete payment</p>
          </div>
          <NewPaymentContainer classifiedId={classifiedId || ''} />
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default Payment;
