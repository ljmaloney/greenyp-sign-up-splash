
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

    console.log('🔍 Email validation API call:', {
      endpoint,
      payload,
      context
    });

    const response = await apiClient.post(endpoint, payload, { requireAuth: false });
    
    console.log('✅ Email validation API response:', response);
    
    // Check for successful response (2xx status)
    if (response && (response.status === 200 || response.success)) {
      return { success: true };
    }
    
    // Handle error responses
    const errorMessage = response?.message || response?.error || 'Email validation failed';
    return { success: false, error: errorMessage };
    
  } catch (error) {
    console.error('❌ Email validation API error:', error);
    
    // Extract error message from API response if available
    if (error instanceof Error) {
      const errorMessage = error.message;
      
      // Enhanced error handling for specific status codes
      if (errorMessage.includes('400')) {
        return { success: false, error: 'Invalid email validation token' };
      }
      if (errorMessage.includes('404')) {
        return { success: false, error: 'Email validation service not found' };
      }
      if (errorMessage.includes('500')) {
        return { success: false, error: 'Server error during validation' };
      }
      return { success: false, error: errorMessage };
    }
    
    return { success: false, error: 'Network error during email validation' };
  }
};
