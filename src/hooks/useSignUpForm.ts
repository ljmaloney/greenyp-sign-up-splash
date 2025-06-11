
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { getApiUrl } from '@/config/api';
import { signUpFormSchema, SignUpFormSchema } from '@/utils/signUpValidation';

export const useSignUpForm = (selectedPlan: string) => {
  const [loading, setLoading] = useState(false);
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

      if (response.ok) {
        toast.success("Account created successfully! Welcome to GreenYP!");
        
        // Redirect to confirmation page with account data
        const confirmationParams = new URLSearchParams({
          businessName: data.businessName,
          plan: selectedSubscription?.displayName || data.subscriptionId,
          email: data.emailAddress,
          phone: data.phoneNumber,
          location: `${data.city}, ${data.state}`,
          website: data.websiteUrl || ''
        });
        
        navigate(`/subscriber/signup/confirmation?${confirmationParams.toString()}`);
      } else {
        const errorData = await response.text();
        console.error('Sign-up error:', errorData);
        toast.error("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    onSubmit
  };
};
