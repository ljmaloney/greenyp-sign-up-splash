
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
      emailAddress: emailAddress,
      token: token
    };

    if (!payload.externRef) {
      const missingField = context === 'classifieds' ? 'classifiedId' : 'producerId';
      return { success: false, error: `Missing ${missingField} for validation` };
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
      externRefLength: payload.externRef?.length
    });

    // Log the exact JSON that will be sent
    const jsonPayload = JSON.stringify(payload);
    console.log('🔍 EMAIL VALIDATION - Raw JSON payload:', jsonPayload);
    console.log('🔍 EMAIL VALIDATION - Payload size:', jsonPayload.length, 'bytes');

    const response = await apiClient.post(endpoint, payload, { requireAuth: false });
    
    console.log('✅ EMAIL VALIDATION - API response received:', {
      response,
      status: response?.status,
      success: response?.success,
      hasResponse: !!response,
      responseKeys: response ? Object.keys(response) : []
    });
    
    // Check for successful response (2xx status)
    if (response && (response.status === 200 || response.success)) {
      return { success: true };
    }
    
    // Handle error responses
    const errorMessage = response?.message || response?.error || 'Email validation failed';
    console.log('❌ EMAIL VALIDATION - Error response details:', {
      errorMessage,
      fullResponse: response
    });
    
    return { success: false, error: errorMessage };
    
  } catch (error) {
    console.error('❌ EMAIL VALIDATION - API error caught:', error);
    
    // Extract error message from API response if available
    if (error instanceof Error) {
      const errorMessage = error.message;
      
      console.log('❌ EMAIL VALIDATION - Error message analysis:', {
        errorMessage,
        includes400: errorMessage.includes('400'),
        includes404: errorMessage.includes('404'),
        includes412: errorMessage.includes('412'),
        includes500: errorMessage.includes('500')
      });
      
      // Enhanced error handling for specific status codes
      if (errorMessage.includes('400')) {
        return { success: false, error: 'Invalid email validation token' };
      }
      if (errorMessage.includes('404')) {
        return { success: false, error: 'Email validation service not found' };
      }
      if (errorMessage.includes('412')) {
        return { success: false, error: 'Email validation failed - token may be invalid or expired' };
      }
      if (errorMessage.includes('500')) {
        return { success: false, error: 'Server error during validation' };
      }
      return { success: false, error: errorMessage };
    }
    
    return { success: false, error: 'Network error during email validation' };
  }
};
