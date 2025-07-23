
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';
import { createPaymentService, PaymentMethodDetails } from '@/services/paymentService';

interface UsePaymentDetailsOptions {
  producerId: string | undefined;
  enabled?: boolean;
}

export const usePaymentDetails = ({ producerId, enabled = true }: UsePaymentDetailsOptions) => {
  const apiClient = useApiClient();
  const paymentService = createPaymentService(apiClient);
  
  return useQuery({
    queryKey: ['payment-details', producerId],
    queryFn: () => {
      if (!producerId) {
        throw new Error('Producer ID is required to fetch payment details');
      }
      return paymentService.fetchPaymentDetails(producerId);
    },
    enabled: !!producerId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    retry: (failureCount, error) => {
      // Don't retry on 404 errors (no payment method yet)
      if (error instanceof Error && error.message.includes('404')) {
        console.log('🔍 PAYMENT DETAILS - No payment method found for producer, this may be expected');
        return false;
      }
      return failureCount < 3;
    },
  });
};
