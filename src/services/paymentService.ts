
import { APIResponse } from '@/types/responseBody';
import { PaymentMethod } from '@/types/payment';

export const createPaymentService = (authenticatedApiClient: any) => ({
  async fetchPaymentMethod(producerId: string): Promise<PaymentMethod | null> {
    console.log('💳 Fetching payment method for producer:', producerId);
    
    const endpoint = `/payment/producer/${producerId}`;
    
    try {
      const data: APIResponse<PaymentMethod> = await authenticatedApiClient.get(endpoint, { requireAuth: true });
      
      console.log('💳 Payment method response:', data);
      
      if (data.errorMessageApi) {
        throw new Error(data.errorMessageApi.displayMessage || 'Failed to fetch payment method');
      }
      
      return data.response || null;
    } catch (error) {
      console.error('❌ Failed to fetch payment method:', error);
      throw error;
    }
  }
});
