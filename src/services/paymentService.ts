
import { useApiClient } from "@/hooks/useApiClient";

export interface PaymentMethodDetails {
  cardType: string;
  lastFour: string;
  expiryDate: string;
  billingAddress: string;
}

export const createPaymentService = (apiClient: any) => {
  return {
    /**
     * Fetch payment method details for a producer
     */
    fetchPaymentDetails: async (producerId: string): Promise<PaymentMethodDetails> => {
      console.log('Fetching payment details for producer:', producerId);
      
      try {
        const response = await apiClient.get(`/account/${producerId}/payment-method`);
        console.log('Payment details response:', response);
        
        if (!response.response) {
          throw new Error('No payment method found');
        }
        
        return response.response;
      } catch (error: any) {
        console.error('Error fetching payment details:', error);
        throw error;
      }
    },
    
    /**
     * Update payment method for a producer
     */
    updatePaymentMethod: async (
      producerId: string, 
      paymentToken: string,
      verificationToken: string,
      billingInfo: {
        firstName: string;
        lastName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        phoneNumber: string;
        emailAddress: string;
        emailValidationToken: string;
      }
    ): Promise<{success: boolean}> => {
      console.log('Updating payment method for producer:', producerId);
      
      try {
        const payload = {
          producerId,
          paymentToken,
          verificationToken,
          ...billingInfo
        };
        
        console.log('Update payment method payload:', payload);
        
        const response = await apiClient.post('/account/update-payment-method', payload);
        console.log('Update payment method response:', response);
        
        return { success: true };
      } catch (error: any) {
        console.error('Error updating payment method:', error);
        throw error;
      }
    }
  };
};
