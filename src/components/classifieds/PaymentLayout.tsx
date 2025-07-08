
import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';

interface PaymentLayoutProps {
  children: React.ReactNode;
}

const PaymentLayout = ({ children }: PaymentLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600">Review your ad details and complete payment</p>
          </div>
          {children}
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default PaymentLayout;
