
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import NewOrderSummaryCard from './NewOrderSummaryCard';
import NewAdPreviewCard from './NewAdPreviewCard';
import NewBillingAddressCard from './NewBillingAddressCard';
import NewSecurePaymentCard from './NewSecurePaymentCard';

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
    enabled: !!classifiedId
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading payment information...</div>
      </div>
    );
  }

  if (!classifiedData) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-500">Failed to load classified information</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-6">
        <NewOrderSummaryCard classified={classifiedData.classified} />
        <NewAdPreviewCard classified={classifiedData.classified} />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <NewBillingAddressCard 
          classified={classifiedData.classified}
          customer={classifiedData.customer}
        />
        <NewSecurePaymentCard 
          customer={classifiedData.customer}
        />
      </div>
    </div>
  );
};

export default NewPaymentContainer;
