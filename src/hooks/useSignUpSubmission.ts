
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { SignUpFormSchema } from '@/utils/signUpValidation';
import { createSignUpPayload, submitSignUpData } from '@/services/signUpService';
import { APIResponse } from '@/types/responseBody';
import { getApiUrl } from '@/config/api';

export const useSignUpSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSystemError, setIsSystemError] = useState(false);
  const navigate = useNavigate();

  const formatErrorMessage = (errorData: any): string => {
    console.log('🔍 Formatting error message from data:', errorData);
    
    // Handle direct error response structure (errorCode, displayMessage, errorDetails)
    if (errorData.errorCode && errorData.displayMessage) {
      const message = errorData.displayMessage;
      const details = errorData.errorDetails;
      console.log('✅ Using direct error format:', { message, details });
      return details ? `${message}: ${details}` : message;
    }
    
    // Handle nested error response structure (errorMessageApi)
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

  const handleSubmit = async (
    data: SignUpFormSchema, 
    selectedSubscription: any, 
    categories: any[]
  ) => {
    console.log('🚀 Starting signup submission');
    console.log('📝 Form data:', { email: data.emailAddress, businessName: data.businessName });
    console.log('📋 Selected subscription:', selectedSubscription?.subscriptionId);
    
    setLoading(true);
    setError(null);
    setIsSystemError(false);
    
    try {
      // Step 1: Create the account
      const payload = createSignUpPayload(data);
      console.log('📤 Sending payload to API');
      
      const { response, status } = await submitSignUpData(payload);
      console.log('📡 API Response Status:', status);

      // Handle success responses (200 or 201)
      if (status === 200 || status === 201) {
        try {
          const responseData: APIResponse<any> = await response.json();
          console.log('✅ Success response received:', responseData);
          console.log('🔍 Full response structure:', JSON.stringify(responseData, null, 2));
          
          // Check if errorMessageApi indicates an error even with 200/201 status
          if (responseData.errorMessageApi) {
            const errorMessage = formatErrorMessage(responseData);
            console.error('❌ API returned error despite success status:', errorMessage);
            setError(errorMessage);
            return;
          }

          // Extract producer data - handle nested response structure
          const producerData = responseData.response?.producer;
          if (!producerData) {
            console.error('❌ Invalid response structure - missing producer data');
            console.log('🔍 Available response keys:', Object.keys(responseData.response || {}));
            setError('Account creation failed - invalid response from server');
            return;
          }

          const producerId = producerData.producerId;
          console.log('🆔 Producer ID extracted:', producerId);

          if (!producerId) {
            console.error('❌ Missing producer ID in response');
            setError('Account creation failed - missing producer ID');
            return;
          }

          // Step 2: Fetch complete account data including subscriptions
          console.log('🔄 Fetching complete account data with subscriptions...');
          const accountData = await fetchAccountData(producerId);
          
          let producerSubscriptions = [];
          
          if (accountData && accountData.response) {
            // Check for subscriptions in the account data response
            if (accountData.response.producer?.subscriptions) {
              producerSubscriptions = accountData.response.producer.subscriptions;
              console.log('📋 Found subscriptions in account data:', producerSubscriptions.length);
            } else if (accountData.response.subscriptions) {
              producerSubscriptions = accountData.response.subscriptions;
              console.log('📋 Found subscriptions in response root:', producerSubscriptions.length);
            }
          }
          
          // Fallback: Check original response for subscriptions
          if (producerSubscriptions.length === 0 && producerData.subscriptions) {
            producerSubscriptions = producerData.subscriptions;
            console.log('📋 Using subscriptions from original response:', producerSubscriptions.length);
          }
          
          // Log the subscription data structure
          if (producerSubscriptions.length > 0) {
            console.log('📋 First subscription structure:', JSON.stringify(producerSubscriptions[0], null, 2));
          } else {
            console.warn('⚠️ No subscriptions found in any response');
            console.log('🔍 Producer data structure:', JSON.stringify(producerData, null, 2));
            console.log('🔍 Account data structure:', JSON.stringify(accountData, null, 2));
          }
          
          console.log('🎉 Account creation successful:', {
            producerId,
            subscriptionsCount: producerSubscriptions.length
          });

          toast.success("Account created successfully! Please complete your payment to activate your subscription.");
          
          // Determine subscription ID - prefer API data, fall back to selected subscription
          let subscriptionIdForUrl = '';
          let subscriptionDataForUrl = null;
          
          if (producerSubscriptions.length > 0) {
            const firstSubscription = producerSubscriptions[0];
            subscriptionIdForUrl = firstSubscription.subscriptionId || firstSubscription.id || '';
            subscriptionDataForUrl = firstSubscription;
            console.log('🔗 Using API subscription ID:', subscriptionIdForUrl);
          } else if (selectedSubscription?.subscriptionId) {
            subscriptionIdForUrl = selectedSubscription.subscriptionId;
            console.log('🔗 Falling back to selected subscription ID:', subscriptionIdForUrl);
          }
          
          if (!subscriptionIdForUrl) {
            console.error('❌ No subscription ID available for payment page');
            setError('Account created but subscription details are missing. Please contact support.');
            return;
          }
          
          // Redirect to payment page with all necessary data
          const paymentParams = new URLSearchParams();
          paymentParams.set('producerId', producerId);
          paymentParams.set('subscription', subscriptionIdForUrl);
          paymentParams.set('email', data.emailAddress);
          paymentParams.set('firstName', data.firstName);
          paymentParams.set('lastName', data.lastName);
          paymentParams.set('phone', data.phoneNumber);
          paymentParams.set('address', data.addressLine1);
          paymentParams.set('city', data.city);
          paymentParams.set('state', data.state);
          paymentParams.set('postalCode', data.postalCode);
          
          // Add the actual subscription data from the API response if available
          if (subscriptionDataForUrl) {
            paymentParams.set('subscriptionData', JSON.stringify(subscriptionDataForUrl));
            console.log('📦 Adding subscription data to URL:', subscriptionDataForUrl.subscriptionId);
          }
          
          const paymentUrl = `/subscriber/signup/payment?${paymentParams.toString()}`;
          console.log('🎯 Navigating to:', paymentUrl);
          navigate(paymentUrl);
          return;
          
        } catch (parseError) {
          console.error('❌ Failed to parse success response:', parseError);
          setError('Invalid response format from server');
          return;
        }
      }

      // Handle 500-series errors (system errors)
      if (status >= 500) {
        console.error('🔥 System error detected:', status);
        setIsSystemError(true);
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
      try {
        const errorText = await response.text();
        console.error('📄 Response text:', errorText);
      } catch (e) {
        console.error('❌ Could not read response text');
      }
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
    handleSubmit
  };
};
