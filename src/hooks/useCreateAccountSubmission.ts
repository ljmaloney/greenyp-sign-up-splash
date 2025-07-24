
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { SignUpFormSchema } from '@/utils/signUpValidation';
import { getApiUrl } from '@/config/api';
import { APIResponse } from '@/types/responseBody';

interface SignUpPayload {
  producerRequest: {
    businessName: string;
    lineOfBusinessId: string;
    subscriptionId: string;
    subscriptionType: string;
    invoiceCycleType: string;
    websiteUrl: string;
    narrative: string;
  };
  primaryContact: {
    contactId?: string;
    producerLocationId?: string;
    producerContactType: string;
    displayContactType: string;
    genericContactName: string;
    firstName: string;
    lastName: string;
    title: string;
    phoneNumber: string;
    cellPhoneNumber: string;
    emailAddress: string;
  };
  primaryLocation: {
    locationId?: string;
    locationName: string;
    locationType: string;
    locationDisplayType: string;
    active: boolean;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    websiteUrl: string;
  };
  masterUserCredentials: {
    producerContactId?: string;
    firstName: string;
    lastName: string;
    businessPhone: string;
    cellPhone: string;
    emailAddress: string;
    userName: string;
    credentials: string;
  };
}

export const useCreateAccountSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createSignUpPayload = (data: SignUpFormSchema): SignUpPayload => {
    return {
      producerRequest: {
        businessName: data.businessName,
        lineOfBusinessId: data.lineOfBusinessId,
        subscriptionId: data.subscriptionId,
        subscriptionType: "LIVE_UNPAID",
        invoiceCycleType: "MONTHLY",
        websiteUrl: data.websiteUrl || "",
        narrative: data.narrative || ""
      },
      primaryContact: {
        producerContactType: "PRIMARY",
        displayContactType: data.displayContactType,
        genericContactName: data.genericContactName || `${data.firstName} ${data.lastName}`,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        title: data.title || "",
        phoneNumber: data.phoneNumber,
        cellPhoneNumber: data.cellPhoneNumber,
        emailAddress: data.emailAddress
      },
      primaryLocation: {
        locationName: data.locationName || "",
        locationType: "HOME_OFFICE_PRIMARY",
        locationDisplayType: data.locationDisplayType,
        active: true,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || "",
        addressLine3: "",
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        latitude: 0,
        longitude: 0,
        websiteUrl: data.websiteUrl || ""
      },
      masterUserCredentials: {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        businessPhone: data.phoneNumber,
        cellPhone: data.cellPhoneNumber,
        emailAddress: data.emailAddress,
        userName: data.userName,
        credentials: data.password
      }
    };
  };

  const handleCreateAccount = async (data: SignUpFormSchema) => {
    console.log('🚀 Starting 3-step account creation process');
    
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Submit to POST /account
      console.log('📤 Step 1: Submitting data to POST /account');
      const payload = createSignUpPayload(data);
      
      const response = await fetch(getApiUrl('/account'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('📡 Response status:', response.status);

      // Step 2: Handle successful response (HTTP 2XX)
      if (response.status >= 200 && response.status < 300) {
        console.log('✅ Step 1 completed: Received HTTP 2XX response');
        
        try {
          const responseData: APIResponse<any> = await response.json();
          console.log('📦 Response data:', responseData);
          
          if (responseData.errorMessageApi) {
            console.error('❌ API returned error despite success status');
            setError('Account creation failed: ' + (responseData.errorMessageApi.displayMessage || 'Unknown error'));
            return;
          }

          const producerData = responseData.response?.producer;
          if (!producerData?.producerId) {
            console.error('❌ Missing producer ID in response');
            setError('Account creation failed: Invalid response from server');
            return;
          }

          const producerId = producerData.producerId;
          console.log('🆔 Producer ID extracted:', producerId);

          // Step 2: Use GET /account/{producerId} to retrieve account data
          console.log('📡 Step 2: Fetching account data with GET /account/' + producerId);
          
          const accountResponse = await fetch(getApiUrl(`/account/${producerId}`));
          console.log('📡 Account fetch response status:', accountResponse.status);
          
          if (!accountResponse.ok) {
            console.error('❌ Failed to fetch account data:', accountResponse.status);
            setError('Failed to retrieve account information');
            return;
          }
          
          const accountData = await accountResponse.json();
          console.log('✅ Step 2 completed: Account data retrieved');

          toast.success("Account created successfully! Please complete your payment to activate your subscription.");
          
          // Step 3: Navigate to payment page
          console.log('🎯 Step 3: Navigating to payment page');
          navigate('/subscribers/signup/payment');
          
        } catch (parseError) {
          console.error('❌ Could not parse response:', parseError);
          setError('Invalid response format from server');
        }
      } else {
        console.error('❌ Non-2XX response status:', response.status);
        
        try {
          const errorData = await response.json();
          const errorMessage = errorData.displayMessage || errorData.errorDetails || `Request failed with status ${response.status}`;
          setError(errorMessage);
        } catch (parseError) {
          setError(`Request failed with status ${response.status}`);
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
