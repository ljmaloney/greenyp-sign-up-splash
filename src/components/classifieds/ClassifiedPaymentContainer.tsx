import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { ClassifiedPaymentData } from '@/types/classifiedPayment';

const ClassifiedPaymentContainer = () => {
  const { classifiedId } = useParams<{ classifiedId: string }>();
  const apiClient = useApiClient();

  const { data: classifiedData, isLoading, error } = useQuery({
    queryKey: ['classified-payment', classifiedId],
    queryFn: async (): Promise<ClassifiedPaymentData> => {
      console.log('Fetching classified data for payment:', classifiedId);
      const response = await apiClient.get(`/classified/${classifiedId}/customer`, { requireAuth: false });
      
      // Type assertion to properly handle the response
      const apiResponse = response as { response: ClassifiedPaymentData };
      return apiResponse.response;
    },
    enabled: !!classifiedId && classifiedId !== ':classifiedId'
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !classifiedData) {
    return <div>Error loading classified data</div>;
  }

  return (
    <div>
      <h2>Payment for: {classifiedData.classified.title}</h2>
      {/* Add your payment form components here */}
    </div>
  );
};

export default ClassifiedPaymentContainer;
