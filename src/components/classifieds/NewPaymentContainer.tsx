
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import PaymentLoadingState from './PaymentLoadingState';
import PaymentErrorState from './PaymentErrorState';
import PaymentLayout from './PaymentLayout';

interface NewPaymentContainerProps {
  classifiedId: string;
}

const NewPaymentContainer = ({ classifiedId }: NewPaymentContainerProps) => {
  const apiClient = useApiClient();

  const { data: classifiedData, isLoading } = useQuery({
    queryKey: ['classified-customer', classifiedId],
    queryFn: async () => {
      console.log('Fetching classified data for ID:', classifiedId);
      const response = await apiClient.get(`/classified/${classifiedId}/customer`, { requireAuth: false });
      return response.response;
    },
    enabled: !!classifiedId && classifiedId !== ':classifiedId'
  });

  if (isLoading) {
    return <PaymentLoadingState />;
  }

  if (!classifiedData) {
    return <PaymentErrorState />;
  }

  return (
    <PaymentLayout 
      classified={classifiedData.classified}
      customer={classifiedData.customer}
    />
  );
};

export default NewPaymentContainer;
