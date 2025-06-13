
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { getApiUrl } from '@/config/api';
import { signUpFormSchema, SignUpFormSchema } from '@/utils/signUpValidation';

export const useSignUpForm = (selectedPlan: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSystemError, setIsSystemError] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      businessName: '',
      lineOfBusinessId: '',
      subscriptionId: selectedPlan,
      websiteUrl: '',
      narrative: '',
      signupCode: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      cellPhoneNumber: '',
      emailAddress: '',
      genericContactName: '',
      title: '',
      displayContactType: 'FULL_NAME_PHONE_EMAIL',
      locationName: '',
      locationDisplayType: 'CITY_STATE_ZIP',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      userName: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Watch for email address changes and update userName accordingly
  const emailAddress = form.watch('emailAddress');
  const userName = form.watch('userName');
  
  useEffect(() => {
    if (emailAddress && (!userName || userName === '')) {
      form.setValue('userName', emailAddress, { shouldValidate: true });
    }
  }, [emailAddress, userName, form]);

  const onSubmit = async (data: SignUpFormSchema, selectedSubscription: any) => {
    setLoading(true);
    setError(null);
    setIsSystemError(false);
    
    try {
      const payload = {
        producerRequest: {
          businessName: data.businessName,
          lineOfBusinessId: data.lineOfBusinessId,
          subscriptionId: data.subscriptionId,
          subscriptionType: "LIVE_UNPAID",
          invoiceCycleType: "MONTHLY",
          websiteUrl: data.websiteUrl,
          narrative: data.narrative,
          signupCode: data.signupCode
        },
        primaryContact: {
          producerContactType: "PRIMARY",
          displayContactType: data.displayContactType,
          genericContactName: data.genericContactName || `${data.firstName} ${data.lastName}`,
          firstName: data.firstName,
          lastName: data.lastName,
          title: data.title,
          phoneNumber: data.phoneNumber,
          cellPhoneNumber: data.cellPhoneNumber,
          emailAddress: data.emailAddress
        },
        primaryLocation: {
          locationName: data.locationName,
          locationType: "HOME_OFFICE_PRIMARY",
          locationDisplayType: data.locationDisplayType,
          active: true,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          addressLine3: "",
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          latitude: "",
          longitude: "",
          websiteUrl: data.websiteUrl
        },
        masterUserCredentials: {
          firstName: data.firstName,
          lastName: data.lastName,
          businessPhone: data.phoneNumber,
          cellPhone: data.cellPhoneNumber,
          emailAddress: data.emailAddress,
          userName: data.userName,
          credentials: data.password
        }
      };

      console.log('Submitting sign-up data:', payload);

      const response = await fetch(getApiUrl('/account'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);

      // Handle success responses (200 or 201)
      if (response.status === 200 || response.status === 201) {
        toast.success("Account created successfully! Welcome to GreenYP!");
        
        // Redirect to confirmation page with account data
        const confirmationParams = new URLSearchParams({
          businessName: data.businessName,
          plan: selectedSubscription?.displayName || 'Selected Plan',
          planPrice: selectedSubscription?.formattedMonthlyPrice || '',
          email: data.emailAddress,
          phone: data.phoneNumber,
          location: `${data.city}, ${data.state}`,
          website: data.websiteUrl || ''
        });
        
        navigate(`/subscriber/signup/confirmation?${confirmationParams.toString()}`);
        return;
      }

      // Handle 500-series errors (system errors)
      if (response.status >= 500) {
        console.error('System error:', response.status);
        setIsSystemError(true);
        return;
      }

      // Handle 400-series errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        try {
          const errorData = await response.json();
          const errorMessage = errorData.errorMessage || `Request failed with status ${response.status}`;
          console.error('Client error:', errorData);
          setError(errorMessage);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          setError(`Request failed with status ${response.status}`);
        }
        return;
      }

      // Handle any other unexpected status codes
      const errorText = await response.text();
      console.error('Unexpected response:', response.status, errorText);
      setError(`Unexpected error occurred. Please try again.`);

    } catch (error) {
      console.error('Network error:', error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    onSubmit,
    error,
    isSystemError
  };
};
