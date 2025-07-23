
interface PaymentTokenData {
  token: string;
  verificationDetails: any;
  billingContact: any;
  billingAddress: any;
}

interface PaymentOptions {
  isSubscription?: boolean;
}

export const processReactSquarePayment = async (
  tokenData: PaymentTokenData,
  referenceId: string,
  apiClient: any,
  emailValidationToken: string,
  options: PaymentOptions = {}
) => {
  const { isSubscription = false } = options;
  console.log(`💳 Processing ${isSubscription ? 'subscription' : ''} payment with React Square SDK...`);

  const { token, billingContact, billingAddress } = tokenData;

  // Prepare base payment data
  const paymentData = {
    referenceId: referenceId,
    paymentToken: token,
    // Note: With react-square-web-payments-sdk, we'll need to handle verification differently
    // For now, we'll use a placeholder verification token
    verificationToken: 'react-sdk-verification',
    firstName: billingContact.firstName.trim(),
    lastName: billingContact.lastName.trim(),
    addressLine1: billingAddress.address.trim(),
    addressLine2: '',
    city: billingAddress.city.trim(),
    state: billingAddress.state?.trim() || 'CA',
    postalCode: billingAddress.zipCode?.trim() || '',
    phoneNumber: billingContact.phone || '',
    emailAddress: billingContact.email.trim(),
    emailValidationToken: emailValidationToken.trim(),
  };

  // Add subscription-specific data if needed
  if (isSubscription) {
    Object.assign(paymentData, {
      producerPayment: {
        actionType: 'APPLY_INITIAL',
        cycleType: 'MONTHLY'
      }
    });
  }

  console.log('📤 Final payment payload:', paymentData);

  // Submit to appropriate backend endpoint
  const endpoint = isSubscription ? '/account/applyInitialPayment' : '/classified/payment';
  const paymentResponse = await apiClient.post(endpoint, paymentData, { requireAuth: false });
  console.log('📊 Payment submission response:', paymentResponse);

  return paymentResponse;
};
