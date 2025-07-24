
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { SignUpFormSchema } from '@/utils/signUpValidation';
import { createSignUpPayload, submitSignUpData } from '@/services/signUpService';
import { APIResponse } from '@/types/responseBody';
import { getApiUrl } from '@/config/api';
import { useEmailDuplicateCheck } from './useEmailDuplicateCheck';

export const useSignUpSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSystemError, setIsSystemError] = useState(false);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
  const navigate = useNavigate();
  const { checkEmailExists } = useEmailDuplicateCheck();

  const formatErrorMessage = (errorData: any): string => {
    console.log('🔍 Formatting error message from data:', errorData);
    
    if (errorData.errorCode === 'DUPLICATE_USER' || 
        errorData.displayMessage?.toLowerCase().includes('already exists') ||
        errorData.errorDetails?.toLowerCase().includes('already exists')) {
      setIsDuplicateEmail(true);
      return 'A user already exists for this email address';
    }
    
    if (errorData.errorCode && errorData.displayMessage) {
      const message = errorData.displayMessage;
      const details = errorData.errorDetails;
      console.log('✅ Using direct error format:', { message, details });
      return details ? `${message}: ${details}` : message;
    }
    
    if (errorData.errorMessageApi) {
      const apiError = errorData.errorMessageApi;
      const message = apiError.displayMessage || apiError.errorDetails || 'An error occurred';
      console.log('✅ Using nested error format:', { apiError, message });
      return message;
    }
    
    const fallbackMessage = errorData.message || errorData.error || 'An unexpected error occurred';
    console.log('⚠️ Using fallback error format:', { fallbackMessage });
    return fallbackMessage;
  };

  const fetchAccountData = async (producerId: string) => {
    console.log('📋 Fetching complete account data for producer:', producerId);
    
    try {
      const accountResponse = await fetch(getApiUrl(`/account/${producerId}`));
      console.log('📡 Account fetch response status:', accountResponse.status);
      
      if (!accountResponse.ok) {
        console.error('❌ Failed to fetch account data:', accountResponse.status);
        return null;
      }
      
      const accountData = await accountResponse.json();
      console.log('✅ Account data fetched successfully:', accountData);
      
      return accountData;
    } catch (error) {
      console.error('❌ Error fetching account data:', error);
      return null;
    }
  };

  const resetError = () => {
    setError(null);
    setIsSystemError(false);
    setIsDuplicateEmail(false);
  };

  const buildPaymentUrl = (producerId: string) => {
    console.log('🔗 Building simplified payment URL');
    
    const paymentParams = new URLSearchParams();
    
    // Only include the essential producerId parameter
    // The payment page will fetch other data via API call
    paymentParams.set('producerId', producerId);
    
    const paymentUrl = `/subscribers/signup/payment?${paymentParams.toString()}`;
    
    console.log('🔍 SIMPLIFIED PAYMENT URL BUILT:', paymentUrl);
    console.log('🔍 PARAMS:', Array.from(paymentParams.entries()));

    return paymentUrl;
  };

  const handleSubmit = async (
    data: SignUpFormSchema, 
    selectedSubscription: any, 
    categories: any[]
  ) => {
    console.log('🚀 Starting signup submission with enhanced error handling');
    console.log('📝 Form data:', { email: data.emailAddress, businessName: data.businessName });
    console.log('📋 Selected subscription details:', {
      subscriptionId: selectedSubscription?.subscriptionId,
      displayName: selectedSubscription?.displayName,
      hasValidSubscription: !!selectedSubscription
    });
    
    setLoading(true);
    resetError();
    
    try {
      // Step 1: Pre-check email availability
      console.log('🔍 Pre-checking email availability...');
      const emailExists = await checkEmailExists(data.emailAddress);
      
      if (emailExists) {
        console.log('❌ Email already exists, stopping submission');
        setIsDuplicateEmail(true);
        setError('A user already exists for this email address');
        setLoading(false);
        return;
      }

      // Step 2: Create the account
      const payload = createSignUpPayload(data);
      console.log('📤 Sending payload to API');
      
      const { response, status } = await submitSignUpData(payload);
      console.log('📡 API Response Status:', status);

      // Handle success responses (200 or 201)
      if (status === 200 || status === 201) {
        try {
          const responseData: APIResponse<any> = await response.json();
          console.log('✅ Success response received:', responseData);
          
          if (responseData.errorMessageApi) {
            const errorMessage = formatErrorMessage(responseData);
            console.error('❌ API returned error despite success status:', errorMessage);
            setError(errorMessage);
            return;
          }

          const producerData = responseData.response?.producer;
          if (!producerData?.producerId) {
            console.error('❌ Invalid response structure - missing producer data');
            setError('Account creation failed - invalid response from server');
            return;
          }

          const producerId = producerData.producerId;
          console.log('🆔 Producer ID extracted:', producerId);

          // Step 3: Fetch complete account data
          const accountData = await fetchAccountData(producerId);
          
          let producerSubscriptions = [];
          if (accountData?.response?.producer?.subscriptions) {
            producerSubscriptions = accountData.response.producer.subscriptions;
          } else if (producerData.subscriptions) {
            producerSubscriptions = producerData.subscriptions;
          }
          
          console.log('🎉 Account creation successful:', {
            producerId,
            subscriptionsCount: producerSubscriptions.length,
            subscriptions: producerSubscriptions
          });

          toast.success("Account created successfully! Please complete your payment to activate your subscription.");
          
          // Step 4: Build simplified payment URL with only producerId
          const paymentUrl = buildPaymentUrl(producerId);
          console.log('⚠️ ABOUT TO NAVIGATE - URL TYPE:', typeof paymentUrl, 'URL VALUE:', paymentUrl);
          
          // Bypass React Router entirely to avoid rendering errors
          console.log('🔄 Using direct browser navigation to avoid React rendering issues');
          window.location.href = paymentUrl;
          
          // Never reaches this point due to page navigation
          console.log('⚠️ NAVIGATION ATTEMPT COMPLETED');  
          return;
          
        } catch (parseError) {
          console.error('❌ Failed to parse success response:', parseError);
          setError('Invalid response format from server');
          return;
        }
      }

      // Handle 412 specifically (likely duplicate email)
      if (status === 412) {
        console.log('❌ 412 Precondition Failed - likely duplicate email');
        setIsDuplicateEmail(true);
        setError('A user already exists for this email address');
        return;
      }

      // Handle 500-series errors (system errors)
      if (status >= 500) {
        console.error('🔥 System error detected:', status);
        setIsSystemError(true);
        setError('System temporarily unavailable. Please try again later.');
        return;
      }

      // Handle 400-series errors (client errors)
      if (status >= 400 && status < 500) {
        console.log('⚠️ Client error detected, parsing response...');
        try {
          const errorData = await response.json();
          console.log('📄 Error response data:', errorData);
          
          const errorMessage = formatErrorMessage(errorData);
          console.log('💬 Final error message:', errorMessage);
          setError(errorMessage);
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          setError(`Request failed with status ${status}`);
        }
        return;
      }

      console.error('❓ Unexpected response status:', status);
      setError('Unexpected error occurred. Please try again.');

    } catch (error) {
      console.error('🌐 Network error occurred:', error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
      console.log('🏁 Signup submission completed');
    }
  };

  return {
    loading,
    error,
    isSystemError,
    isDuplicateEmail,
    handleSubmit,
    resetError
  };
};
