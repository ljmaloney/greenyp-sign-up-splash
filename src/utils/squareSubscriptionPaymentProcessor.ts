
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
  
  // Debug billing data before processing
  console.log('🔍 Billing data received:', {
    billingContact,
    billingAddress,
    producerId,
    emailValidationToken
  });
  
  // Validate required billing address data
  if (!billingAddress.address || billingAddress.address.trim() === '') {
    console.error('❌ Missing required billing address');
    throw new Error('Billing address is required');
  }
  
  if (!billingContact.firstName || billingContact.firstName.trim() === '') {
    console.error('❌ Missing required first name');
    throw new Error('First name is required');
  }
  
  if (!billingContact.lastName || billingContact.lastName.trim() === '') {
    console.error('❌ Missing required last name');
    throw new Error('Last name is required');
  }
  
  if (!billingContact.email || billingContact.email.trim() === '') {
    console.error('❌ Missing required email');
    throw new Error('Email is required');
  }
  
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
      
      // Prepare payload with explicit field mapping and validation
      const subscriptionPaymentData = {
        producerId: producerId,
        sourceId: result.token,
        verificationToken: verificationResult.token,
        firstName: billingContact.firstName.trim(),
        lastName: billingContact.lastName.trim(),
        emailAddress: billingContact.email.trim(),
        phoneNumber: squareFormattedPhone,
        payorAddress1: billingAddress.address.trim(), // This is the critical field the backend needs
        locality: billingAddress.city?.trim() || 'Oakland',
        administrativeDistrictLevel1: billingAddress.state?.trim() || 'CA',
        postalCode: billingAddress.zipCode?.trim() || '',
        country: 'US',
        emailValidationToken: emailValidationToken.trim()
      };

      console.log('📤 Final subscription payment payload (with validation):', subscriptionPaymentData);
      
      // Additional validation before sending
      if (!subscriptionPaymentData.payorAddress1) {
        console.error('❌ Critical error: payorAddress1 is still empty after processing');
        throw new Error('Billing address cannot be empty');
      }
      
      // Submit to backend endpoint
      const paymentResponse = await apiClient.post('/account/applyInitialPayment', subscriptionPaymentData, { requireAuth: false });
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
