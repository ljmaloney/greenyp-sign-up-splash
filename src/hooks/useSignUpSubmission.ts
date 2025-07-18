
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
    
    // Check for duplicate email/username error
    if (errorData.errorCode === 'DUPLICATE_USER' || 
        errorData.displayMessage?.toLowerCase().includes('already exists') ||
        errorData.errorDetails?.toLowerCase().includes('already exists')) {
      setIsDuplicateEmail(true);
      return 'A user already exists for this email address';
    }
    
    // Handle direct error response structure
    if (errorData.errorCode && errorData.displayMessage) {
      const message = errorData.displayMessage;
      const details = errorData.errorDetails;
      console.log('✅ Using direct error format:', { message, details });
      return details ? `${message}: ${details}` : message;
    }
    
    // Handle nested error response structure
    if (errorData.errorMessageApi) {
      const apiError = errorData.errorMessageApi;
      const message = apiError.displayMessage || apiError.errorDetails || 'An error occurred';
      console.log('✅ Using nested error format:', { apiError, message });
      return message;
    }
    
    // Fallback for other error structures
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

  const handleSubmit = async (
    data: SignUpFormSchema, 
    selectedSubscription: any, 
    categories: any[]
  ) => {
    console.log('🚀 Starting signup submission');
    console.log('📝 Form data:', { email: data.emailAddress, businessName: data.businessName });
    console.log('📋 Selected subscription details:', {
      subscriptionId: selectedSubscription?.subscriptionId,
      displayName: selectedSubscription?.displayName,
      hasValidSubscription: !!selectedSubscription
    });
    
    setLoading(true);
    resetError();
    
    try {
      // Step 1: Check if email already exists
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
          
          // Check if errorMessageApi indicates an error even with 200/201 status
          if (responseData.errorMessageApi) {
            const errorMessage = formatErrorMessage(responseData);
            console.error('❌ API returned error despite success status:', errorMessage);
            setError(errorMessage);
            return;
          }

          // Extract producer data
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
          
          // Navigate to payment page with improved parameter handling
          const paymentParams = new URLSearchParams();
          paymentParams.set('producerId', producerId);
          
          // Ensure subscription ID is properly set
          const subscriptionIdToPass = selectedSubscription?.subscriptionId || data.subscriptionId || '';
          console.log('🔗 Setting subscription parameter:', {
            fromSelectedSubscription: selectedSubscription?.subscriptionId,
            fromFormData: data.subscriptionId,
            finalSubscriptionId: subscriptionIdToPass
          });
          
          paymentParams.set('subscription', subscriptionIdToPass);
          paymentParams.set('email', data.emailAddress);
          paymentParams.set('firstName', data.firstName);
          paymentParams.set('lastName', data.lastName);
          paymentParams.set('phone', data.phoneNumber);
          paymentParams.set('address', data.addressLine1);
          paymentParams.set('city', data.city);
          paymentParams.set('state', data.state);
          paymentParams.set('postalCode', data.postalCode);
          
          // Add API subscription data if available
          if (producerSubscriptions.length > 0) {
            console.log('📋 Adding API subscription data to URL parameters:', producerSubscriptions[0]);
            paymentParams.set('subscriptionData', JSON.stringify(producerSubscriptions[0]));
          }
          
          const paymentUrl = `/subscriber/signup/payment?${paymentParams.toString()}`;
          console.log('🎯 Navigating to payment page:', {
            url: paymentUrl,
            parametersSet: {
              producerId,
              subscription: subscriptionIdToPass,
              hasApiSubscriptionData: producerSubscriptions.length > 0
            }
          });
          
          navigate(paymentUrl);
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

      // Handle any other unexpected status codes
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
