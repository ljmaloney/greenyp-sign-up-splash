
import { useApiClient } from '@/hooks/useApiClient';

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
  // We can't use useApiClient hook here since this is not a component
  // Instead, we'll create the API client directly
  const { apiClient } = await import('@/utils/apiClient');
  
  try {
    let endpoint: string;
    let payload: any;

    if (context === 'classifieds') {
      endpoint = `/classified/${classifiedId}/validateEmail`;
      payload = {
        emailValidationToken: token,
        emailAddress: emailAddress
      };
    } else {
      endpoint = `/account/${producerId}/validateEmail`;
      payload = {
        emailValidationToken: token,
        emailAddress: emailAddress
      };
    }

    console.log('🔍 Email validation request:', {
      endpoint,
      context,
      emailAddress,
      hasToken: !!token,
      classifiedId,
      producerId
    });

    const response = await apiClient.post(endpoint, payload, { requireAuth: false });
    
    console.log('✅ Email validation response:', response);
    
    // Check for successful response
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
