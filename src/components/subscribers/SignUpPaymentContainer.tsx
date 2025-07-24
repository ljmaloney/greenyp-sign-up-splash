
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import EmailValidationCard from '@/components/payment/EmailValidationCard';
import PaymentInformationCard from '@/components/payment/PaymentInformationCard';
import ReactSquareSubscriptionCard from './ReactSquareSubscriptionCard';
import SubscriptionSummaryCard from './SubscriptionSummaryCard';
import { getApiUrl } from '@/config/api';

const SignUpPaymentContainer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Extract data from URL params
  const producerId = searchParams.get('producerId');
  const subscriptionPlan = searchParams.get('plan');
  const subscriptionPrice = searchParams.get('planPrice');
  
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [billingContact, setBillingContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [billingAddress, setBillingAddress] = useState({
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [emailValidationToken, setEmailValidationToken] = useState('');
  const [isEmailValidated, setIsEmailValidated] = useState(false);


  // Fetch producer data using producerId
  useEffect(() => {
    const fetchProducerData = async () => {
      if (!producerId) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('📊 Fetching producer data for ID:', producerId);
        const response = await fetch(getApiUrl(`/account/${producerId}`));
        
        if (!response.ok) {
          throw new Error(`Failed to fetch producer data: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Producer data retrieved:', data);
        
        // Extract business name from response
        const businessNameFromApi = data?.response?.producer?.businessName || 'Business';
        setBusinessName(businessNameFromApi);
        
        // You could extract other useful data here as well
        // For example, subscription details, etc.
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error fetching producer data:', error);
        toast({
          title: "Data Retrieval Error",
          description: "Unable to load your account information. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchProducerData();
  }, [producerId, toast]);

  const handleBillingInfoChange = (contact: any, address: any, emailToken: string) => {
    setBillingContact(contact);
    setBillingAddress(address);
    if (emailToken) {
      setEmailValidationToken(emailToken);
    }
  };

  const handleEmailValidated = (token: string) => {
    setEmailValidationToken(token);
    setIsEmailValidated(true);
    toast({
      title: "Email Validated",
      description: "Your email has been successfully validated.",
    });
  };

  if (!producerId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Missing Producer ID</h2>
        <p className="text-gray-600">Please complete the signup process first.</p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Loading Account Information</h2>
        <p className="text-gray-600">Please wait while we retrieve your account details...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <SubscriptionSummaryCard
            businessName={businessName || ''}
            subscriptionPlan={subscriptionPlan || 'Basic Listing'}
            subscriptionPrice={subscriptionPrice || '$5'}
            producerId={producerId || ''}
        />
      </div>
      <div className="space-y-6">
        <EmailValidationCard
            validationToken={emailValidationToken}
            onChange={setEmailValidationToken}
            emailAddress={billingContact.email}
            helperText="Please validate your email address to continue"
            isValidated={isEmailValidated}
            onValidate={() => handleEmailValidated(emailValidationToken)}
        />
        <PaymentInformationCard
          classified={{}}
          customer={{
            firstName: billingContact.firstName,
            lastName: billingContact.lastName,
            emailAddress: billingContact.email,
            phoneNumber: billingContact.phone,
            address: billingAddress.address,
            city: billingAddress.city,
            state: billingAddress.state,
            postalCode: billingAddress.zipCode
          }}
          onBillingInfoChange={handleBillingInfoChange}
          emailValidationToken={emailValidationToken}
          isEmailValidated={isEmailValidated}
        />
        

        <ReactSquareSubscriptionCard
            billingContact={{
              firstName: billingContact.firstName,
              lastName: billingContact.lastName,
              email: billingContact.email,
              phone: billingContact.phone
            }}
            billingAddress={{
              address: billingAddress.address,
              // address2 is handled internally, not needed for the API payload
              city: billingAddress.city,
              state: billingAddress.state,
              zipCode: billingAddress.zipCode
            }}
            emailValidationToken={emailValidationToken}
            producerId={producerId}
        />
      </div>

    </div>
  );
};

export default SignUpPaymentContainer;
