
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { SignUpFormSchema } from '@/utils/signUpValidation';
import { createSignUpPayload, submitSignUpData } from '@/services/signUpService';

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

      // Handle success responses (200 or 201)
      if (status === 200 || status === 201) {
        const responseData = await response.json();
        console.log('Success response data:', responseData);
        
        toast.success("Account created successfully! Please complete your payment to activate your subscription.");
        
        // Redirect to payment page with producer ID and form data
        const paymentParams = new URLSearchParams();
        paymentParams.set('producerId', responseData.producerId || responseData.id);
        paymentParams.set('subscription', selectedSubscription?.subscriptionId || '');
        paymentParams.set('email', data.emailAddress);
        paymentParams.set('firstName', data.firstName);
        paymentParams.set('lastName', data.lastName);
        paymentParams.set('phone', data.phoneNumber);
        paymentParams.set('address', data.addressLine1);
        paymentParams.set('city', data.city);
        paymentParams.set('state', data.state);
        paymentParams.set('postalCode', data.postalCode);
        
        navigate(`/subscriber/signup/payment?${paymentParams.toString()}`);
        return;
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
          const errorData = await response.json();
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
