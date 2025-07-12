
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

export const processSquareSignUpTokens = async (
  card: any,
  payments: any,
  billingContact: BillingContactData,
  billingAddress: BillingAddressData
) => {
  console.log('Starting tokenization process...');
  
  // Tokenize the card
  const result = await card.tokenize();
  console.log('Tokenization result:', result);

  if (result.status === 'OK') {
    console.log('Card tokenized successfully, token:', result.token);
    
    // Normalize phone number to Square's required format (+1XXXXXXXXXX)
    const squareFormattedPhone = normalizePhoneForSquare(billingContact.phone);
    console.log('Original phone:', billingContact.phone);
    console.log('Square formatted phone:', squareFormattedPhone);
    
    // Prepare verification details using billing information
    const verificationDetails = {
      amount: '1.00',
      billingContact: {
        givenName: billingContact.firstName || 'John',
        familyName: billingContact.lastName || 'Doe',
        email: billingContact.email || 'john.doe@example.com',
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

    console.log('Starting buyer verification with details:', verificationDetails);
    
    // Verify the buyer
    const verificationResult = await payments.verifyBuyer(result.token, verificationDetails);
    console.log('Verification result:', verificationResult);

    if (verificationResult && verificationResult.token) {
      console.log('Payment verified successfully');
      return {
        paymentToken: result.token,
        verificationToken: verificationResult.token
      };
    } else {
      console.error('Verification failed:', verificationResult.errors);
      throw new Error('Payment verification failed');
    }
  } else {
    console.error('Tokenization failed:', result.errors);
    throw new Error('Failed to process payment card');
  }
};
