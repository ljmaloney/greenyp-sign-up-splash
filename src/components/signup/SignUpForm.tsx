
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { getApiUrl } from '@/config/api';
import { SignUpFormData } from '@/types/signUpForm';
import { signUpFormSchema, SignUpFormSchema } from '@/utils/signUpValidation';
import BusinessInformationCard from './BusinessInformationCard';
import ContactInformationCard from './ContactInformationCard';
import LocationInformationCard from './LocationInformationCard';
import AccountCredentialsCard from './AccountCredentialsCard';

interface SignUpFormProps {
  selectedPlan: string;
}

const SignUpForm = ({ selectedPlan }: SignUpFormProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { data: subscriptions } = useSubscriptions();

  // Find the selected subscription to display its name
  const selectedSubscription = subscriptions?.find(sub => sub.subscriptionId === selectedPlan);
  
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

  const onSubmit = async (data: SignUpFormSchema) => {
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
          genericContactName: `${data.firstName} ${data.lastName}`,
          firstName: data.firstName,
          lastName: data.lastName,
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Create Your GreenYP Account
        </h1>
        <p className="text-lg text-gray-600">
          Join thousands of green industry professionals growing their business
        </p>
        {selectedSubscription && (
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-green-800 font-medium">
              Selected Plan: {selectedSubscription.displayName}
            </p>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <BusinessInformationCard control={form.control} />
          <ContactInformationCard control={form.control} />
          <LocationInformationCard control={form.control} />
          <AccountCredentialsCard control={form.control} />

          <div className="flex justify-center pt-6">
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="underline hover:text-green-600">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-green-600">Privacy Policy</a>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
