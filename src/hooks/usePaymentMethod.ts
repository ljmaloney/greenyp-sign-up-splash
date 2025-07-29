
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';
import { PaymentMethod } from '@/types/payment';

export const usePaymentMethod = (producerId: string) => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ['payment-method', producerId],
    queryFn: async (): Promise<PaymentMethod | null> => {
      if (!producerId) return null;
      
      console.log('🔍 Fetching payment method for producer:', producerId);
      
      try {
        const response = await apiClient.get(`/payment/producer/${producerId}`, { requireAuth: true });
        
        // If response is empty or null, return null
        if (!response.response) {
          return null;
        }
        
        // Ensure we have the required producerId field
        const paymentMethod = response.response as PaymentMethod;
        if (!paymentMethod.producerId) {
          paymentMethod.producerId = producerId;
        }
        
        return paymentMethod;
      } catch (error: any) {
        if (error.status === 404) {
          console.log('ℹ️ No payment method found for producer');
          return null;
        }
        throw error;
      }
    },
    enabled: !!producerId
  });
};
