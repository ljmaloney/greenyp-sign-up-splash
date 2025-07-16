
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

  const handleSubmit = async (
    data: SignUpFormSchema, 
    selectedSubscription: any, 
    categories: any[]
  ) => {
    setLoading(true);
    setError(null);
    setIsSystemError(false);
    
    try {
      const payload = createSignUpPayload(data);
      const { response, status } = await submitSignUpData(payload);

      console.log('API Response Status:', status);

      // Handle success responses (200 or 201)
      if (status === 200 || status === 201) {
        try {
          const responseData: APIResponse<any> = await response.json();
          console.log('Success response data:', responseData);
          
          // Check if errorMessageApi indicates an error even with 200/201 status
          if (responseData.errorMessageApi) {
            console.error('API returned error despite success status:', responseData.errorMessageApi);
            const errorMessage = responseData.errorMessageApi.displayMessage || 
                              responseData.errorMessageApi.errorDetails || 
                              'An error occurred during account creation';
            setError(errorMessage);
            return;
          }

          // The API response structure is: { response: { producer: { producerId, subscriptions: [...] } } }
          const producerData = responseData.response?.producer;
          if (!producerData) {
            console.error('Invalid response structure - missing producer data:', responseData);
            setError('Account creation failed - invalid response from server');
            return;
          }

          const producerId = producerData.producerId;
          const producerSubscriptions = producerData.subscriptions || [];
          
          console.log('Producer data:', {
            producerId,
            subscriptionsCount: producerSubscriptions.length,
            subscriptions: producerSubscriptions
          });

          if (!producerId) {
            console.error('Invalid response structure - missing producer ID');
            setError('Account creation failed - missing producer ID');
            return;
          }

          console.log('Account creation successful, proceeding to payment');
          
          toast.success("Account created successfully! Please complete your payment to activate your subscription.");
          
          // Redirect to payment page with producer ID, form data, and subscription data
          const paymentParams = new URLSearchParams();
          paymentParams.set('producerId', producerId);
          paymentParams.set('subscription', selectedSubscription?.subscriptionId || '');
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
          
          navigate(`/subscriber/signup/payment?${paymentParams.toString()}`);
          return;
          
        } catch (parseError) {
          console.error('Failed to parse success response:', parseError);
          setError('Invalid response format from server');
          return;
        }
      }

      // Handle 500-series errors (system errors)
      if (status >= 500) {
        console.error('System error:', status);
        setIsSystemError(true);
        return;
      }

      // Handle 400-series errors (client errors)
      if (status >= 400 && status < 500) {
        try {
          const errorData: APIResponse<any> = await response.json();
          console.log('Error response data:', errorData);
          
          // Extract error message from the API response structure
          const errorMessage = errorData.errorMessageApi?.displayMessage || 
                              errorData.errorMessageApi?.errorDetails || 
                              `Request failed with status ${status}`;
          
          console.error('Client error:', errorData);
          setError(errorMessage);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          setError(`Request failed with status ${status}`);
        }
        return;
      }

      // Handle any other unexpected status codes
      const errorText = await response.text();
      console.error('Unexpected response:', status, errorText);
      setError(`Unexpected error occurred. Please try again.`);

    } catch (error) {
      console.error('Network error:', error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    isSystemError,
    handleSubmit
  };
};
