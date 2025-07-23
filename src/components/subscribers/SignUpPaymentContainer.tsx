
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import BillingContactForm from '@/components/payment/BillingContactForm';
import BillingAddressForm from '@/components/payment/BillingAddressForm';
import EmailValidationCard from '@/components/payment/EmailValidationCard';
import ReactSquareSubscriptionCard from './ReactSquareSubscriptionCard';
import SubscriptionSummaryCard from './SubscriptionSummaryCard';

const SignUpPaymentContainer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Extract data from URL params
  const producerId = searchParams.get('producerId');
  const businessName = searchParams.get('businessName');
  const subscriptionPlan = searchParams.get('plan');
  const subscriptionPrice = searchParams.get('planPrice');

  const [billingContact, setBillingContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [billingAddress, setBillingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [emailValidationToken, setEmailValidationToken] = useState('');
  const [isEmailValidated, setIsEmailValidated] = useState(false);

  // Redirect if missing required data
  useEffect(() => {
    if (!producerId || !businessName) {
      toast({
        title: "Missing Information",
        description: "Please complete the signup process first.",
        variant: "destructive",
      });
      navigate('/subscribers/signup');
    }
  }, [producerId, businessName, navigate, toast]);

  const handleBillingContactChange = (field: string, value: string) => {
    setBillingContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBillingAddressChange = (field: string, value: string) => {
    setBillingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailValidated = (token: string) => {
    setEmailValidationToken(token);
    setIsEmailValidated(true);
    toast({
      title: "Email Validated",
      description: "Your email has been successfully validated.",
    });
  };

  if (!producerId || !businessName) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Missing Information</h2>
        <p className="text-gray-600">Please complete the signup process first.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <BillingContactForm
          billingContact={billingContact}
          onChange={handleBillingContactChange}
        />
        
        <BillingAddressForm
          billingAddress={billingAddress}
          onChange={handleBillingAddressChange}
        />
        
        <EmailValidationCard
          validationToken={emailValidationToken}
          onChange={setEmailValidationToken}
          emailAddress={billingContact.email}
          helperText="Please validate your email address to continue"
          isValidated={isEmailValidated}
          onValidate={() => handleEmailValidated(emailValidationToken)}
        />
      </div>

      <div className="space-y-6">
        <SubscriptionSummaryCard
          businessName={businessName || ''}
          subscriptionPlan={subscriptionPlan || 'Basic Listing'}
          subscriptionPrice={subscriptionPrice || '$5'}
          producerId={producerId || ''}
        />
        
        <ReactSquareSubscriptionCard
          billingContact={billingContact}
          billingAddress={billingAddress}
          emailValidationToken={emailValidationToken}
          producerId={producerId}
        />
      </div>
    </div>
  );
};

export default SignUpPaymentContainer;
