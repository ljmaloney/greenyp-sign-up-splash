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

interface PaymentOptions {
  isSubscription?: boolean;
}

export const processSquarePayment = async (
  card: any,
  payments: any,
  billingContact: BillingContactData,
  billingAddress: BillingAddressData,
  referenceId: string,
  apiClient: any,
  emailValidationToken: string,
  options: PaymentOptions = {}
) => {
  const { isSubscription = false } = options;
  console.log(`💳 Starting ${isSubscription ? 'subscription' : ''} payment tokenization process...`);
  
  // Debug billing data before processing
  console.log('🔍 Billing data received:', {
    billingContact,
    billingAddress,
    referenceId: referenceId,
    emailValidationToken
  });
  
  // Validate required billing data (enhanced validation for subscriptions)
  if (isSubscription) {
    if (!billingAddress.address?.trim()) {
      console.error('❌ Missing required billing address');
      throw new Error('Billing address is required');
    }
    
    if (!billingAddress.city?.trim()) {
      console.error('❌ Missing required billing city');
      throw new Error('Billing city is required');
    }
    
    if (!billingContact.firstName?.trim()) {
      console.error('❌ Missing required first name');
      throw new Error('First name is required');
    }
    
    if (!billingContact.lastName?.trim()) {
      console.error('❌ Missing required last name');
      throw new Error('Last name is required');
    }
    
    if (!billingContact.email?.trim()) {
      console.error('❌ Missing required email');
      throw new Error('Email is required');
    }
  }
  
  // Tokenize the card
  const result = await card.tokenize();
  console.log('🔍 Tokenization result:', result);

  if (result.status === 'OK') {
    console.log('✅ Card tokenized successfully, token:', result.token);
    
    // Normalize phone number to Square's required format
    const squareFormattedPhone = normalizePhoneForSquare(billingContact.phone);
    console.log('📞 Phone formatting:', {
      original: billingContact.phone,
      formatted: squareFormattedPhone
    });
    
    // Prepare verification details
    const verificationDetails = {
      amount: '1.00',
      billingContact: {
        givenName: billingContact.firstName || 'John',
        familyName: billingContact.lastName || 'Doe',
        email: billingContact.email || 'user@example.com',
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

    console.log('🔐 Starting buyer verification with details:', verificationDetails);
    
    // Verify the buyer
    const verificationResult = await payments.verifyBuyer(result.token, verificationDetails);
    console.log('✅ Verification result:', verificationResult);

    if (verificationResult?.token) {
      console.log('🎯 Payment verified successfully, submitting to backend...');
      
      // Prepare base payment data
      const paymentData = {
        referenceId: referenceId,
        paymentToken: result.token,
        verificationToken: verificationResult.token,
        firstName: billingContact.firstName.trim(),
        lastName: billingContact.lastName.trim(),
        addressLine1: billingAddress.address.trim(),
        addressLine2: '',
        city: billingAddress.city.trim(),
        state: billingAddress.state?.trim() || 'CA',
        postalCode: billingAddress.zipCode?.trim() || '',
        phoneNumber: squareFormattedPhone,
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

        // Additional validation for subscription payments
        if (!paymentData.addressLine1) {
          console.error('❌ Critical error: address is still empty after processing');
          throw new Error('Billing address cannot be empty');
        }
        
        if (!paymentData.city) {
          console.error('❌ Critical error: city is still empty after processing');
          throw new Error('Billing city cannot be empty');
        }
      }

      console.log('📤 Final payment payload:', paymentData);
      
      // Submit to appropriate backend endpoint
      const endpoint = isSubscription ? '/account/applyInitialPayment' : '/classified/payment';
      const paymentResponse = await apiClient.post(endpoint, paymentData, { requireAuth: false });
      console.log('📊 Payment submission response:', paymentResponse);
      
      return paymentResponse;
    } else {
      console.error('❌ Verification failed:', verificationResult.errors);
      throw new Error('Payment verification failed');
    }
  } else {
    console.error('❌ Tokenization failed:', result.errors);
    throw new Error('Failed to process payment card');
  }
};