
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { SignUpFormSchema } from '@/utils/signUpValidation';
import { validateSignUpForm } from '@/services/signUpValidationService';
import { createSignUpPayload, submitSignUpData, fetchAccountData } from '@/services/signUpSubmissionService';
import { APIResponse } from '@/types/responseBody';

export const useCreateAccountSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const buildPaymentUrl = (producerId: string, data: SignUpFormSchema, accountData: any) => {
    console.log('🔗 Building payment URL with account data');
    
    const paymentParams = new URLSearchParams();
    
    // Essential parameters
    paymentParams.set('producerId', producerId);
    paymentParams.set('email', data.emailAddress);
    paymentParams.set('firstName', data.firstName || '');
    paymentParams.set('lastName', data.lastName || '');
    
    // Optional contact parameters
    if (data.phoneNumber) paymentParams.set('phone', data.phoneNumber);
    if (data.addressLine1) paymentParams.set('address', data.addressLine1);
    if (data.city) paymentParams.set('city', data.city);
    if (data.state) paymentParams.set('state', data.state);
    if (data.postalCode) paymentParams.set('postalCode', data.postalCode);
    
    // Add subscription information from form data
    if (data.subscriptionId) {
      paymentParams.set('subscription', data.subscriptionId);
    }
    
    // Add account data for additional context
    if (accountData) {
      paymentParams.set('accountData', JSON.stringify(accountData));
    }
    
    const paymentUrl = `/subscribers/signup/payment?${paymentParams.toString()}`;
    
    console.log('🎯 Payment URL constructed:', {
      producerId,
      subscriptionId: data.subscriptionId,
      hasAccountData: !!accountData,
      fullUrl: paymentUrl
    });
    
    return paymentUrl;
  };

  const handleCreateAccount = async (data: SignUpFormSchema) => {
    console.log('🚀 Starting 4-step account creation process');
    
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Validate the form
      console.log('📋 Step 1: Validating form data');
      const validation = validateSignUpForm(data);
      
      if (!validation.isValid) {
        console.log('❌ Step 1 failed: Form validation errors:', validation.errors);
        setError(`Form validation failed: ${validation.errors.join(', ')}`);
        setLoading(false);
        return;
      }
      
      console.log('✅ Step 1 completed: Form validation passed');

      // Step 2: Submit JSON payload to POST /account
      console.log('📤 Step 2: Submitting data to POST /account');
      const payload = createSignUpPayload(data);
      const { response, status } = await submitSignUpData(payload);

      // Step 3: Handle successful response (HTTP 2XX)
      if (status >= 200 && status < 300) {
        console.log('✅ Step 2 completed: Received HTTP 2XX response');
        console.log('📋 Step 3: Processing successful response');
        
        try {
          const responseData: APIResponse<any> = await response.json();
          console.log('📦 Response data:', responseData);
          
          if (responseData.errorMessageApi) {
            console.error('❌ Step 3 failed: API returned error despite success status');
            setError('Account creation failed: ' + (responseData.errorMessageApi.displayMessage || 'Unknown error'));
            return;
          }

          const producerData = responseData.response?.producer;
          if (!producerData?.producerId) {
            console.error('❌ Step 3 failed: Missing producer ID in response');
            setError('Account creation failed: Invalid response from server');
            return;
          }

          const producerId = producerData.producerId;
          console.log('🆔 Step 3 completed: Producer ID extracted:', producerId);

          // Step 4: Use GET /account/{producerId} to retrieve account data
          console.log('📡 Step 4: Fetching account data with GET /account/' + producerId);
          const accountData = await fetchAccountData(producerId);
          console.log('✅ Step 4 completed: Account data retrieved');

          toast.success("Account created successfully! Please complete your payment to activate your subscription.");
          
          // Navigate to payment page with all data
          const paymentUrl = buildPaymentUrl(producerId, data, accountData);
          console.log('🎯 Navigating to payment page:', paymentUrl);
          navigate(paymentUrl);
          
        } catch (parseError) {
          console.error('❌ Step 3 failed: Could not parse response:', parseError);
          setError('Invalid response format from server');
        }
      } else {
        console.error('❌ Step 2 failed: Non-2XX response status:', status);
        
        try {
          const errorData = await response.json();
          const errorMessage = errorData.displayMessage || errorData.errorDetails || `Request failed with status ${status}`;
          setError(errorMessage);
        } catch (parseError) {
          setError(`Request failed with status ${status}`);
        }
      }

    } catch (error) {
      console.error('🌐 Network error during account creation:', error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
      console.log('🏁 Account creation process completed');
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    handleCreateAccount,
    resetError
  };
};
