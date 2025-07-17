
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { SignUpFormSchema } from '@/utils/signUpValidation';
import { createSignUpPayload, submitSignUpData } from '@/services/signUpService';
import { APIResponse } from '@/types/responseBody';

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

          // The API response structure is: { response: { producer: { producerId, subscriptions: [...] } } }
          const producerData = responseData.response?.producer;
          if (!producerData) {
            console.error('❌ Invalid response structure - missing producer data');
            setError('Account creation failed - invalid response from server');
            return;
          }

          const producerId = producerData.producerId;
          const producerSubscriptions = producerData.subscriptions || [];
          
          console.log('🎉 Account creation successful:', {
            producerId,
            subscriptionsCount: producerSubscriptions.length
          });

          if (!producerId) {
            console.error('❌ Missing producer ID in response');
            setError('Account creation failed - missing producer ID');
            return;
          }

          toast.success("Account created successfully! Please complete your payment to activate your subscription.");
          
          // Get the subscription ID from the producer's subscription data (API response)
          const producerSubscriptionId = producerSubscriptions.length > 0 ? 
            producerSubscriptions[0].subscriptionId : 
            selectedSubscription?.subscriptionId || '';
          
          console.log('🔗 Redirecting to payment with subscription ID:', producerSubscriptionId);
          
          // Redirect to payment page with producer ID, form data, and subscription data
          const paymentParams = new URLSearchParams();
          paymentParams.set('producerId', producerId);
          paymentParams.set('subscription', producerSubscriptionId);
          paymentParams.set('email', data.emailAddress);
          paymentParams.set('firstName', data.firstName);
          paymentParams.set('lastName', data.lastName);
          paymentParams.set('phone', data.phoneNumber);
          paymentParams.set('address', data.addressLine1);
          paymentParams.set('city', data.city);
          paymentParams.set('state', data.state);
          paymentParams.set('postalCode', data.postalCode);
          
          // Add the actual subscription data from the API response
          if (producerSubscriptions.length > 0) {
            paymentParams.set('subscriptionData', JSON.stringify(producerSubscriptions[0]));
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
