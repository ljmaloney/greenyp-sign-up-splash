
import { BillingContact, TokenizationRequest, SquareTokenizationResult, SquareCardData } from '@/types/square';

export const cleanBillingContact = (billingContact: any): BillingContact => {
  return {
    givenName: String(billingContact.givenName || ''),
    familyName: String(billingContact.familyName || ''),
    email: String(billingContact.email || ''),
    phone: String(billingContact.phone || '').replace(/\D/g, '')
  };
};

export const createTokenizationRequest = (billingContact: BillingContact, includeVerification = false): TokenizationRequest => {
  const request: TokenizationRequest = {
    billingContact
  };

  if (includeVerification) {
    request.verificationDetails = {
      billingContact,
      intent: 'CHARGE' as const,
      customerInitiated: Boolean(true),
      sellerKeyedIn: Boolean(false)
    };
  }

  return request;
};

export const handleSquareTokenizationError = (tokenResult: SquareTokenizationResult): string => {
  console.error('Square tokenization failed:', tokenResult);
  
  let errorMessage = 'Payment information is invalid';
  
  if (tokenResult.errors && Array.isArray(tokenResult.errors)) {
    const errorDetails = tokenResult.errors.map((error: any) => {
      console.error('Square error details:', error);
      
      // Handle specific Square error codes
      if (error.code === 'INVALID_CARD_DATA') {
        return 'Invalid card information provided';
      }
      if (error.code === 'CARD_EXPIRED') {
        return 'Card has expired';
      }
      if (error.code === 'CVV_FAILURE') {
        return 'Invalid CVV code';
      }
      if (error.code === 'ADDRESS_VERIFICATION_FAILURE') {
        return 'Billing address verification failed';
      }
      if (error.code === 'INSUFFICIENT_PERMISSIONS') {
        return 'Payment processing not authorized';
      }
      if (error.code === 'INVALID_REQUEST_ERROR') {
        return 'Invalid payment request';
      }
      
      // Fallback to error detail or message
      return error.detail || error.message || 'Payment processing error';
    });
    
    errorMessage = errorDetails.join('. ');
  }
  
  return errorMessage;
};

export const processTokenization = async (
  card: any,
  billingContact: any
): Promise<SquareCardData> => {
  console.log('Starting tokenization with billingContact:', billingContact);
  
  const cleanContact = cleanBillingContact(billingContact);
  console.log('Clean billing contact:', cleanContact);

  // First attempt: Try without verificationDetails (simpler approach)
  let tokenizationRequest = createTokenizationRequest(cleanContact, false);
  console.log('Square tokenization request (simple):', JSON.stringify(tokenizationRequest, null, 2));

  let tokenResult = await card.tokenize(tokenizationRequest);
  console.log('Square tokenization result (simple):', JSON.stringify(tokenResult, null, 2));

  // If simple approach fails, try with verificationDetails
  if (tokenResult.status !== 'OK') {
    console.log('Simple tokenization failed, trying with verificationDetails...');
    
    tokenizationRequest = createTokenizationRequest(cleanContact, true);
    console.log('Square tokenization request (with verification):', JSON.stringify(tokenizationRequest, null, 2));
    
    tokenResult = await card.tokenize(tokenizationRequest);
    console.log('Square tokenization result (with verification):', JSON.stringify(tokenResult, null, 2));
  }

  if (tokenResult.status === 'OK') {
    console.log('Square tokenization successful');
    return {
      token: tokenResult.token!,
      details: tokenResult.details!
    };
  } else {
    const errorMessage = handleSquareTokenizationError(tokenResult);
    throw new Error(errorMessage);
  }
};
