
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useApiClient } from '@/hooks/useApiClient';
import SubscribersHeader from '@/components/SubscribersHeader';
import BusinessInfoStep from './components/BusinessInfoStep';
import ContactInfoStep from './components/ContactInfoStep';
import LocationInfoStep from './components/LocationInfoStep';
import UserCredentialsStep from './components/UserCredentialsStep';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface SignupFormData {
  businessName: string;
  lineOfBusinessId: string;
  subscriptionId: string;
  websiteUrl: string;
  narrative: string;
  genericContactName: string;
  firstName: string;
  lastName: string;
  title: string;
  phoneNumber: string;
  cellPhoneNumber: string;
  emailAddress: string;
  locationName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  postalCode: string;
  locationWebsiteUrl: string;
  userFirstName: string;
  userLastName: string;
  businessPhone: string;
  cellPhone: string;
  userEmailAddress: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

const SubscriberSignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const apiClient = useApiClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    businessName: '',
    lineOfBusinessId: '',
    subscriptionId: '',
    websiteUrl: '',
    narrative: '',
    genericContactName: '',
    firstName: '',
    lastName: '',
    title: '',
    phoneNumber: '',
    cellPhoneNumber: '',
    emailAddress: '',
    locationName: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    city: '',
    state: '',
    postalCode: '',
    locationWebsiteUrl: '',
    userFirstName: '',
    userLastName: '',
    businessPhone: '',
    cellPhone: '',
    userEmailAddress: '',
    userName: '',
    password: '',
    confirmPassword: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const buildSubmissionData = () => {
    return {
      producerRequest: {
        businessName: formData.businessName,
        lineOfBusinessId: formData.lineOfBusinessId,
        subscriptionId: formData.subscriptionId,
        subscriptionType: "LIVE_UNPAID",
        invoiceCycleType: "MONTHLY",
        websiteUrl: formData.websiteUrl,
        narrative: formData.narrative
      },
      primaryContact: {
        producerContactType: "PRIMARY",
        displayContactType: "NO_DISPLAY",
        genericContactName: formData.genericContactName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        title: formData.title,
        phoneNumber: formData.phoneNumber,
        cellPhoneNumber: formData.cellPhoneNumber,
        emailAddress: formData.emailAddress
      },
      primaryLocation: {
        locationName: formData.locationName,
        locationType: "HOME_OFFICE_PRIMARY",
        locationDisplayType: "NO_DISPLAY",
        active: true,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        addressLine3: formData.addressLine3,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        latitude: 0,
        longitude: 0,
        websiteUrl: formData.locationWebsiteUrl
      },
      masterUserCredentials: {
        firstName: formData.userFirstName,
        lastName: formData.userLastName,
        businessPhone: formData.businessPhone,
        cellPhone: formData.cellPhone,
        emailAddress: formData.userEmailAddress,
        userName: formData.userName,
        credentials: formData.password
      }
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const submissionData = buildSubmissionData();
      console.log('📤 Submitting signup data:', submissionData);
      
      const response = await apiClient.post('/account', submissionData, { requireAuth: false });
      
      console.log('✅ Signup successful:', response);
      
      toast({
        title: "Account Created Successfully!",
        description: "Welcome to GreenYP! You can now access your dashboard.",
      });
      
      // Redirect to dashboard or login page
      navigate('/dashboard');
      
    } catch (error) {
      console.error('❌ Signup failed:', error);
      
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ContactInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <LocationInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <UserCredentialsStep
            formData={formData}
            updateFormData={updateFormData}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SubscribersHeader />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Join GreenYP as a Professional
              </CardTitle>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </CardHeader>
            <CardContent>
              {renderCurrentStep()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriberSignUp;
