
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';
import { createPaymentService } from '@/services/paymentService';

export const usePaymentMethod = (producerId: string) => {
  const apiClient = useApiClient();
  const paymentService = createPaymentService(apiClient);
  
  return useQuery({
    queryKey: ['payment-method', producerId],
    queryFn: () => {
      if (!producerId) {
        throw new Error('Producer ID is required to fetch payment method');
      }
      return paymentService.fetchPaymentMethod(producerId);
    },
    enabled: !!producerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    retry: (failureCount, error) => {
      // Don't retry on 404 errors (no payment method found)
      if (error.message.includes('404')) {
        console.log('🔍 PAYMENT METHOD - No payment method found for producer');
        return false;
      }
      return failureCount < 3;
    },
  });
};
