
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
    
    // Create payload exactly as specified by the user
    const payload = {
      externRef: context === 'classifieds' ? classifiedId : producerId,
      emailAddress: emailAddress.trim(), // Ensure no whitespace
      token: token.trim() // Ensure no whitespace
    };

    if (!payload.externRef) {
      const missingField = context === 'classifieds' ? 'classifiedId' : 'producerId';
      return { success: false, error: `Missing ${missingField} for validation` };
    }

    console.log('🔍 EMAIL VALIDATION - Pre-validation checks:', {
      tokenLength: payload.token.length,
      tokenFirstChars: payload.token.substring(0, 10),
      tokenLastChars: payload.token.substring(payload.token.length - 10),
      emailLength: payload.emailAddress.length,
      emailValue: payload.emailAddress,
      externRefLength: payload.externRef.length,
      externRefValue: payload.externRef,
      context
    });

    // Validate payload before sending
    if (!payload.token || payload.token.length === 0) {
      console.error('❌ EMAIL VALIDATION - Token is empty or invalid');
      return { success: false, error: 'Token is required and cannot be empty' };
    }

    if (!payload.emailAddress || payload.emailAddress.length === 0) {
      console.error('❌ EMAIL VALIDATION - Email address is empty or invalid');
      return { success: false, error: 'Email address is required and cannot be empty' };
    }

    if (!payload.externRef || payload.externRef.length === 0) {
      console.error('❌ EMAIL VALIDATION - External reference is empty or invalid');
      return { success: false, error: 'External reference is required and cannot be empty' };
    }

    console.log('🔍 EMAIL VALIDATION - Detailed payload being sent:', {
      endpoint,
      payload,
      context,
      // Log each field separately for clarity
      externRef: payload.externRef,
      emailAddress: payload.emailAddress,
      token: payload.token,
      tokenLength: payload.token?.length,
      emailLength: payload.emailAddress?.length,
      externRefLength: payload.externRef?.length,
      tokenType: typeof payload.token,
      emailType: typeof payload.emailAddress,
      externRefType: typeof payload.externRef
    });

    // Log the exact JSON that will be sent
    const jsonPayload = JSON.stringify(payload);
    console.log('🔍 EMAIL VALIDATION - Raw JSON payload:', jsonPayload);
    console.log('🔍 EMAIL VALIDATION - Payload size:', jsonPayload.length, 'bytes');

    // Check for any non-printable characters or encoding issues
    const tokenHasNonPrintable = /[^\x20-\x7E]/.test(payload.token);
    const emailHasNonPrintable = /[^\x20-\x7E]/.test(payload.emailAddress);
    const externRefHasNonPrintable = /[^\x20-\x7E]/.test(payload.externRef);
    
    console.log('🔍 EMAIL VALIDATION - Character validation:', {
      tokenHasNonPrintable,
      emailHasNonPrintable,
      externRefHasNonPrintable,
      tokenCharCodes: [...payload.token].map(c => c.charCodeAt(0)).slice(0, 10),
      emailCharCodes: [...payload.emailAddress].map(c => c.charCodeAt(0)).slice(0, 10)
    });

    const response = await apiClient.post(endpoint, payload, { requireAuth: false });
    
    console.log('✅ EMAIL VALIDATION - API response received:', {
      response,
      status: response?.status,
      success: response?.success,
      hasResponse: !!response,
      responseKeys: response ? Object.keys(response) : [],
      fullResponseObject: response
    });
    
    // Check for successful response (2xx status)
    if (response && (response.status === 200 || response.success)) {
      console.log('✅ EMAIL VALIDATION - Validation successful');
      return { success: true };
    }
    
    // Handle error responses
    const errorMessage = response?.message || response?.error || 'Email validation failed';
    console.log('❌ EMAIL VALIDATION - Error response details:', {
      errorMessage,
      fullResponse: response,
      responseStatus: response?.status,
      responseSuccess: response?.success
    });
    
    return { success: false, error: errorMessage };
    
  } catch (error) {
    console.error('❌ EMAIL VALIDATION - API error caught:', error);
    
    // Extract error message from API response if available
    if (error instanceof Error) {
      const errorMessage = error.message;
      
      console.log('❌ EMAIL VALIDATION - Error message analysis:', {
        errorMessage,
        errorName: error.name,
        errorStack: error.stack?.split('\n').slice(0, 5),
        includes400: errorMessage.includes('400'),
        includes404: errorMessage.includes('404'),
        includes412: errorMessage.includes('412'),
        includes500: errorMessage.includes('500')
      });
      
      // Enhanced error handling for specific status codes
      if (errorMessage.includes('400')) {
        return { success: false, error: 'Bad request - invalid email validation token format' };
      }
      if (errorMessage.includes('404')) {
        return { success: false, error: 'Email validation service not found' };
      }
      if (errorMessage.includes('412')) {
        return { 
          success: false, 
          error: 'Email validation failed - the token may be expired, already used, or does not match the email address and reference ID combination' 
        };
      }
      if (errorMessage.includes('500')) {
        return { success: false, error: 'Server error during validation' };
      }
      return { success: false, error: errorMessage };
    }
    
    return { success: false, error: 'Network error during email validation' };
  }
};
