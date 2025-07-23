
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import PaymentConfirmationContent from '@/components/classifieds/PaymentConfirmationContent';
import PaymentLoadingState from '@/components/classifieds/PaymentLoadingState';
import PaymentErrorState from '@/components/classifieds/PaymentErrorState';

const PaymentConfirmation = () => {
  const { classifiedId } = useParams<{ classifiedId: string }>();
  const [searchParams] = useSearchParams();
  const paymentSuccess = searchParams.get('paymentSuccess');
  const orderRef = searchParams.get('orderRef');
  const paymentRef = searchParams.get('paymentRef');
  const receiptNumber = searchParams.get('receiptNumber');
  const apiClient = useApiClient();

  const { data: classifiedData, isLoading, error } = useQuery({
    queryKey: ['classified-payment-confirmation', classifiedId],
    queryFn: async () => {
      console.log('Fetching classified data for confirmation page:', classifiedId);
      const response = await apiClient.get(`/classified/${classifiedId}/customer`, { requireAuth: false });
      return response.response;
    },
    enabled: !!classifiedId && classifiedId !== ':classifiedId'
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <PaymentLoadingState />
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  if (error || !classifiedData) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <PaymentErrorState />
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <PaymentConfirmationContent 
          classified={classifiedData.classified}
          customer={classifiedData.customer}
          paymentSuccess={paymentSuccess === 'true'}
          orderRef={orderRef || undefined}
          paymentRef={paymentRef || undefined}
          receiptNumber={receiptNumber || undefined}
        />
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default PaymentConfirmation;
