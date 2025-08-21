import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useLineOfBusiness } from '@/hooks/useLineOfBusiness';
import { findSubscriptionMatch } from '@/utils/subscriptionMatching';
import EmailValidationCard from '@/components/payment/EmailValidationCard';
import PaymentInformationCard from '@/components/payment/PaymentInformationCard';
import ReactSquareSubscriptionCard from '@/components/subscribers/ReactSquareSubscriptionCard';
import SubscriptionDetailsCard from '@/components/subscribers/SubscriptionDetailsCard';
import BusinessDetailsCard from '@/components/subscribers/BusinessDetailsCard';
import { getApiUrl } from '@/config/api';
import { Producer, PrimaryLocation } from '@/services/accountService';
import { normalizePhoneForSquare } from '@/utils/phoneUtils';

interface BillingInformation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

const SignUpPaymentContainer = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Extract data from URL params
  const producerId = searchParams.get('producerId');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [producer, setProducer] = useState<Producer | null>(null);
  const [primaryLocation, setPrimaryLocation] = useState<PrimaryLocation | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);

  // Fetch subscriptions and line of business data
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const { data: lineOfBusinessData } = useLineOfBusiness();

  // Updated billing information state using consolidated structure
  const [billingInfo, setBillingInfo] = useState<BillingInformation>({
    firstName: searchParams.get('firstName') || '',
    lastName: searchParams.get('lastName') || '',
    email: searchParams.get('email') || '',
    phone: searchParams.get('phone') || '',
    address: searchParams.get('address') || '',
    address2: '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    zipCode: searchParams.get('postalCode') || ''
  });

  const [emailValidationToken, setEmailValidationToken] = useState('');
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Find subscription details
  const selectedSubscription = findSubscriptionMatch(subscriptions, producer?.subscriptions?.[0]?.subscriptionId || null);

  // Find line of business name
  const lineOfBusinessName = lineOfBusinessData?.find(
    lob => lob.lineOfBusinessId === producer?.lineOfBusinessId
  )?.lineOfBusinessName || 'Unknown';

  // Fetch producer data using producerId
  useEffect(() => {
    const fetchProducerData = async () => {
      // For development/preview, provide fallback data if no producerId
      if (!producerId) {
        const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
        if (isDevelopment) {
          console.log('📊 Development mode: Using fallback business name');
          setBusinessName('Sample Business Name');
          setIsLoading(false);
          return;
        }
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
        
        if (data.response) {
          const { producer: producerData, primaryLocation: locationData, contacts: contactsData } = data.response;
          setProducer(producerData);
          setPrimaryLocation(locationData);
          setBusinessName(producerData.businessName || 'Business');
          
          // Store the contacts array directly from the API response
          if (Array.isArray(contactsData)) {
            console.log('📃 Setting contacts from API response:', contactsData);
            setContacts(contactsData);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error fetching producer data:', error);
        
        // In development, don't show error toast and use fallback
        const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
        if (isDevelopment) {
          console.log('📊 Development mode: Using fallback business name due to API error');
          setBusinessName('Sample Business Name');
        } else {
          toast({
            title: "Data Retrieval Error",
            description: "Unable to load your account information. Please try again.",
            variant: "destructive",
          });
        }
        setIsLoading(false);
      }
    };
    
    fetchProducerData();
  }, [producerId]);

  // Updated handler to work with new PaymentInformationCard interface
  const handleBillingInfoChange = (updatedBillingInfo: BillingInformation, emailToken: string) => {
    setBillingInfo(updatedBillingInfo);
    if (emailToken && emailToken !== emailValidationToken) {
      setEmailValidationToken(emailToken);
    }
  };

  // Get the admin email address from the contacts array in the response
  const getAdminEmail = () => {
    // Check the contacts array that we stored directly from the API response
    if (Array.isArray(contacts) && contacts.length > 0) {
      // Find the admin contact in the contacts array
      const adminContact = contacts.find(c => c.producerContactType === 'ADMIN');
      if (adminContact?.emailAddress) {
        console.log('🔍 Using admin email from contacts array:', adminContact.emailAddress);
        return adminContact.emailAddress;
      }
    }
    
    // Fallback to billing info email
    return billingInfo.email || '';
  };

  // Get the admin contact information for copying
  const getAdminContact = () => {
    if (Array.isArray(contacts) && contacts.length > 0) {
      const adminContact = contacts.find(c => c.producerContactType === 'ADMIN');
      if (adminContact) {
        return adminContact;
      }
    }
    return null;
  };

  const handleEmailValidated = async () => {
    if (!emailValidationToken.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a verification code",
        variant: "destructive",
      });
      return;
    }

    // Get the email address for validation from admin contact
    const emailAddress = getAdminEmail();
    if (!emailAddress) {
      toast({
        title: "Validation Error",
        description: "Email address is missing",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    setValidationError('');
    
    try {
      console.log('📧 Using email for validation:', emailAddress);
      
      // Call the email validation endpoint
      const response = await fetch(getApiUrl('/email/validate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          externRef: producerId || '',
          emailAddress: emailAddress,
          token: emailValidationToken.trim()
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to validate email');
      }
      
      // If successful
      setIsEmailValidated(true);
      toast({
        title: "Email Validated",
        description: "Your email has been successfully validated.",
      });
      
    } catch (error) {
      console.error('❌ Email validation error:', error);
      setValidationError(error instanceof Error ? error.message : 'Failed to validate email');
      toast({
        title: "Validation Failed",
        description: error instanceof Error ? error.message : 'Failed to validate email',
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Prepare copy from account data for the new interface - FIXED VERSION
  const copyFromAccountData: BillingInformation | undefined = (() => {
    const adminContact = getAdminContact();
    
    if (!adminContact || !primaryLocation) {
      return undefined;
    }

    return {
      firstName: adminContact.firstName || '',
      lastName: adminContact.lastName || '',
      email: adminContact.emailAddress || '',
      phone: normalizePhoneForSquare(adminContact.phoneNumber || ''),
      address: primaryLocation.addressLine1 || '',
      address2: primaryLocation.addressLine2 || '',
      city: primaryLocation.city || '',
      state: primaryLocation.state || '',
      zipCode: primaryLocation.postalCode || ''
    };
  })();

  // Show loading state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Loading Account Information</h2>
        <p className="text-gray-600">Please wait while we retrieve your account details...</p>
      </div>
    );
  }

  // Show missing producer ID warning only in production
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
  if (!producerId && !isDevelopment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Missing Producer ID</h2>
        <p className="text-gray-600">Please complete the signup process first.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <SubscriptionDetailsCard
          subscription={selectedSubscription}
          isLoading={subscriptionsLoading}
        />
        
        <BusinessDetailsCard
          producer={producer}
          primaryLocation={primaryLocation}
          lineOfBusinessName={lineOfBusinessName}
          isLoading={isLoading}
        />
      </div>
      <div className="space-y-6">
        <EmailValidationCard
          validationToken={emailValidationToken}
          onChange={setEmailValidationToken}
          emailAddress={getAdminEmail()}
          helperText={`We have sent a confirmation email to ${getAdminEmail()}. Please check your email and enter the token below to validate.`}
          isValidated={isEmailValidated}
          isValidating={isValidating}
          validationError={validationError}
          onValidate={handleEmailValidated}
        />
        <div className={!isEmailValidated ? "opacity-50 pointer-events-none" : ""}>  
          <h3 className="text-lg font-medium mb-2">Billing Information</h3>
          <p className="text-sm text-gray-500 mb-4">{!isEmailValidated ? "Please validate your email address to enable this section" : "Please enter your billing information below"}</p>
          <PaymentInformationCard
            initialBillingInfo={billingInfo}
            onBillingInfoChange={handleBillingInfoChange}
            emailValidationToken={emailValidationToken}
            isEmailValidated={isEmailValidated}
            copyFromAdData={copyFromAccountData}
            showCopyButton={true}
          />
        </div>
        
        <div className={!isEmailValidated ? "opacity-50 pointer-events-none" : ""}>  
          <h3 className="text-lg font-medium mb-2">Payment Method</h3>
          <p className="text-sm text-gray-500 mb-4">{!isEmailValidated ? "Please validate your email address to enable this section" : "Please enter your payment information below"}</p>
          <ReactSquareSubscriptionCard
            billingContact={{
              firstName: billingInfo.firstName || '',
              lastName: billingInfo.lastName || '',
              email: billingInfo.email || '',
              phone: normalizePhoneForSquare(billingInfo.phone) || ''
            }}
            billingAddress={{
              address: billingInfo.address || '',
              city: billingInfo.city || '',
              state: billingInfo.state || '',
              zipCode: billingInfo.zipCode || ''
            }}
            emailValidationToken={emailValidationToken}
            producerId={producerId || ''}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPaymentContainer;