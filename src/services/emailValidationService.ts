
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
    // Use unified endpoint for all email validation
    const endpoint = '/email/validate';
    
    // Map context-specific IDs to externRef
    let externRef: string;
    if (context === 'classifieds') {
      if (!classifiedId) {
        return { success: false, error: 'Missing classified ID for validation' };
      }
      externRef = classifiedId;
    } else {
      if (!producerId) {
        return { success: false, error: 'Missing producer ID for validation' };
      }
      externRef = producerId;
    }

    // Create unified payload structure
    const payload = {
      emailAddress: emailAddress,
      token: token,
      externRef: externRef,
    };

    console.log('🔍 Email validation request:', {
      endpoint,
      context,
      emailAddress,
      hasToken: !!token,
      externRef,
      payload
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
      
      // Enhanced error handling for specific status codes
      if (errorMessage.includes('412')) {
        console.error('🚨 Payload validation error - API expects different field structure');
        return { success: false, error: 'Invalid email validation request format. Please contact support if this persists.' };
      }
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
