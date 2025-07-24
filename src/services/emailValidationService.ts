
import { apiClient } from '@/utils/apiClient';

interface EmailValidationRequest {
  token: string;
  emailAddress: string;
  context: 'classifieds' | 'subscribers';
  classifiedId?: string;
  producerId?: string;
}

interface EmailValidationResponse {
  success: boolean;
  error?: string;
}

export const validateEmailToken = async ({
  token,
  emailAddress,
  context,
  classifiedId,
  producerId
}: EmailValidationRequest): Promise<EmailValidationResponse> => {
  try {
    const endpoint = '/email/validate';
    
    console.log('🔍 EMAIL VALIDATION SERVICE - Received token parameter:', token);
    console.log('🔍 EMAIL VALIDATION SERVICE - Token length:', token?.length);
    console.log('🔍 EMAIL VALIDATION SERVICE - Token value:', token);
    
    // Create payload with token EXPLICITLY copied from the input parameter
    const payload = {
      externRef: context === 'classifieds' ? classifiedId : producerId,
      emailAddress: emailAddress.trim(),
      token: token.trim() // EXPLICITLY using the token parameter from emailValidationToken
    };

    console.log('🔍 EMAIL VALIDATION SERVICE - Payload token field set to:', payload.token);
    console.log('🔍 EMAIL VALIDATION SERVICE - Payload token length:', payload.token?.length);
    console.log('🔍 EMAIL VALIDATION SERVICE - Full payload:', payload);

    if (!payload.externRef) {
      const missingField = context === 'classifieds' ? 'classifiedId' : 'producerId';
      return { success: false, error: `Missing ${missingField} for validation` };
    }

    // Validate payload before sending
    if (!payload.token || payload.token.length === 0) {
      console.error('❌ EMAIL VALIDATION SERVICE - Token is empty or invalid');
      return { success: false, error: 'Token is required and cannot be empty' };
    }

    if (!payload.emailAddress || payload.emailAddress.length === 0) {
      console.error('❌ EMAIL VALIDATION SERVICE - Email address is empty or invalid');
      return { success: false, error: 'Email address is required and cannot be empty' };
    }

    if (!payload.externRef || payload.externRef.length === 0) {
      console.error('❌ EMAIL VALIDATION SERVICE - External reference is empty or invalid');
      return { success: false, error: 'External reference is required and cannot be empty' };
    }

    console.log('🔍 EMAIL VALIDATION SERVICE - Final payload being sent:', payload);
    console.log('🔍 EMAIL VALIDATION SERVICE - Final payload.token:', payload.token);

    const response = await apiClient.post(endpoint, payload, { requireAuth: false });
    
    console.log('✅ EMAIL VALIDATION SERVICE - API response received:', response);
    
    if (response && (response.status === 200 || response.success)) {
      console.log('✅ EMAIL VALIDATION SERVICE - Validation successful');
      return { success: true };
    }
    
    const errorMessage = response?.message || response?.error || 'Email validation failed';
    console.log('❌ EMAIL VALIDATION SERVICE - Error response:', errorMessage);
    
    return { success: false, error: errorMessage };
    
  } catch (error) {
    console.error('❌ EMAIL VALIDATION SERVICE - API error:', error);
    
    if (error instanceof Error) {
      const errorMessage = error.message;
      
      if (errorMessage.includes('412')) {
        return { 
          success: false, 
          error: 'Email validation failed - the token may be expired, already used, or does not match the email address and reference ID combination' 
        };
      }
      return { success: false, error: errorMessage };
    }
    
    return { success: false, error: 'Network error during email validation' };
  }
};
