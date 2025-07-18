
import { normalizePhoneForSquare } from '@/utils/phoneUtils';

interface BillingContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BillingAddressData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export const processSquareSubscriptionPayment = async (
  card: any,
  payments: any,
  billingContact: BillingContactData,
  billingAddress: BillingAddressData,
  producerId: string,
  apiClient: any,
  emailValidationToken: string
) => {
  console.log('💳 Starting subscription payment tokenization process...');
  
  // Tokenize the card
  const result = await card.tokenize();
  console.log('🔍 Subscription tokenization result:', result);

  if (result.status === 'OK') {
    console.log('✅ Card tokenized successfully for subscription, token:', result.token);
    
    // Normalize phone number to Square's required format
    const squareFormattedPhone = normalizePhoneForSquare(billingContact.phone);
    console.log('📞 Phone formatting:', {
      original: billingContact.phone,
      formatted: squareFormattedPhone
    });
    
    // Prepare verification details for subscription payment
    const verificationDetails = {
      amount: '1.00', // Minimal verification amount
      billingContact: {
        givenName: billingContact.firstName || 'John',
        familyName: billingContact.lastName || 'Doe',
        email: billingContact.email || 'subscriber@example.com',
        phone: squareFormattedPhone || '+13214563987',
        addressLines: [billingAddress.address || '123 Main Street'],
        city: billingAddress.city || 'Oakland',
        state: billingAddress.state || 'CA',
        countryCode: 'US',
      },
      currencyCode: 'USD',
      intent: 'CHARGE',
      customerInitiated: true,
      sellerKeyedIn: false,
    };

    console.log('🔐 Starting buyer verification for subscription with details:', verificationDetails);
    
    // Verify the buyer
    const verificationResult = await payments.verifyBuyer(result.token, verificationDetails);
    console.log('✅ Subscription verification result:', verificationResult);

    if (verificationResult && verificationResult.token) {
      console.log('🎯 Payment verified successfully for subscription, submitting to backend...');
      
      // Submit subscription payment to backend
      const subscriptionPaymentData = {
        producerId: producerId,
        paymentToken: result.token,
        verificationToken: verificationResult.token,
        firstName: billingContact.firstName,
        lastName: billingContact.lastName,
        address: billingAddress.address,
        city: billingAddress.city || 'Oakland',
        state: billingAddress.state || 'CA',
        postalCode: billingAddress.zipCode,
        phoneNumber: squareFormattedPhone,
        emailAddress: billingContact.email,
        emailValidationToken: emailValidationToken
      };

      console.log('📤 Submitting subscription payment data:', subscriptionPaymentData);
      
      // TODO: Update this endpoint when subscription payment API is available
      const paymentResponse = await apiClient.post('/subscription/payment', subscriptionPaymentData, { requireAuth: false });
      console.log('📊 Subscription payment submission response:', paymentResponse);
      
      return paymentResponse;
    } else {
      console.error('❌ Subscription verification failed:', verificationResult.errors);
      throw new Error('Subscription payment verification failed');
    }
  } else {
    console.error('❌ Subscription tokenization failed:', result.errors);
    throw new Error('Failed to process subscription payment card');
  }
};
