
export interface PaymentResponse {
  paymentStatus: string;
  orderRef?: string;
  paymentRef?: string;
  receiptNumber?: string;
}

export interface ProcessPaymentResult {
  response?: PaymentResponse;
  error?: string;
}

export const processReactSquarePayment = async (
  tokenData: any,
  referenceId: string,
  apiClient: any,
  emailValidationToken: string,
  options?: { 
    isSubscription?: boolean,
    billingContact?: any,
    billingAddress?: any
  }
): Promise<ProcessPaymentResult> => {
  console.log('💳 Processing React Square payment...', {
    referenceId,
    hasToken: !!tokenData.token,
    hasEmailToken: !!emailValidationToken,
    isSubscription: options?.isSubscription,
    billingContact: options?.billingContact,
    billingAddress: options?.billingAddress
  });

  try {
    // Create the payload for the /account/applyInitialPayment endpoint
    const paymentPayload = {
      // Map producerId to referenceId as per requirements
      referenceId: referenceId,
      paymentToken: tokenData.token,
      verificationToken: tokenData.verificationToken || '',
      emailValidationToken: emailValidationToken,
      
      // Contact information
      firstName: options?.billingContact?.firstName || '',
      lastName: options?.billingContact?.lastName || '',
      emailAddress: options?.billingContact?.email || '',
      phoneNumber: options?.billingContact?.phone || '',
      
      // Company information (if available)
      companyName: options?.billingContact?.companyName || '',
      
      // Address information
      addressLine1: options?.billingAddress?.address || '',
      addressLine2: options?.billingAddress?.address2 || '',
      city: options?.billingAddress?.city || '',
      state: options?.billingAddress?.state || '',
      postalCode: options?.billingAddress?.zipCode || '',
      
      // Payment configuration
      producerPayment: {
        paymentMethod: 'CREDIT_CARD', // Default payment method
        actionType: 'APPLY_ONCE',     // One-time payment
        cycleType: 'MONTHLY'          // Monthly subscription
      }
    };

    console.log('🚀 Sending payment payload to /account/applyInitialPayment:', paymentPayload);
    
    // Make the actual API call
    const response = await apiClient.post('/account/applyInitialPayment', paymentPayload);
    
    // Handle successful response
    console.log('✅ Payment API response:', response);
    
    return {
      response: {
        paymentStatus: response?.paymentStatus || 'COMPLETED',
        orderRef: response?.orderRef || `order_${Date.now()}`,
        paymentRef: response?.paymentRef || `payment_${Date.now()}`,
        receiptNumber: response?.receiptNumber || `receipt_${Date.now()}`
      }
    };
    
  } catch (error) {
    console.error('❌ Payment processing error:', error);
    return {
      error: error instanceof Error ? error.message : 'Payment processing failed'
    };
  }
};
