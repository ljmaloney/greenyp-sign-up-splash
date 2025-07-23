
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
     * Replace payment method for a producer using the new endpoint
     */
    replacePaymentMethod: async (
      referenceId: string,
      paymentToken: string,
      verificationToken: string,
      billingInfo: {
        firstName: string;
        lastName: string;
        companyName: string;
        payorAddress1: string;
        payorAddress2?: string;
        payorCity: string;
        payorState: string;
        payorPostalCode: string;
        phoneNumber: string;
        emailAddress: string;
        emailValidationToken: string;
      }
    ): Promise<{success: boolean}> => {
      console.log('Replacing payment method for reference ID:', referenceId);
      
      try {
        const payload = {
          referenceId,
          paymentToken,
          verificationToken,
          emailValidationToken: billingInfo.emailValidationToken,
          firstName: billingInfo.firstName,
          lastName: billingInfo.lastName,
          companyName: billingInfo.companyName,
          payorAddress1: billingInfo.payorAddress1,
          payorAddress2: billingInfo.payorAddress2 || '',
          payorCity: billingInfo.payorCity,
          payorState: billingInfo.payorState,
          payorPostalCode: billingInfo.payorPostalCode,
          phoneNumber: billingInfo.phoneNumber,
          emailAddress: billingInfo.emailAddress
        };
        
        console.log('Replace payment method payload:', payload);
        
        const response = await apiClient.post('/payment/replace', payload);
        console.log('Replace payment method response:', response);
        
        return { success: true };
      } catch (error: any) {
        console.error('Error replacing payment method:', error);
        throw error;
      }
    }
  };
};
