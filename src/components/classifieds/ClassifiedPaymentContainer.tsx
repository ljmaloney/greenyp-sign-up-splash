
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import BillingContactForm from '@/components/payment/BillingContactForm';
import BillingAddressForm from '@/components/payment/BillingAddressForm';
import EmailValidationCard from '@/components/payment/EmailValidationCard';
import ClassifiedSummaryCard from './ClassifiedSummaryCard';
import ReactSquarePaymentCard from './ReactSquarePaymentCard';

interface ClassifiedPaymentContainerProps {
  classifiedId: string;
}

const ClassifiedPaymentContainer = ({ classifiedId }: ClassifiedPaymentContainerProps) => {
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
  
  const apiClient = useApiClient();
  const { toast } = useToast();

  // Fetch classified data
  const { data: classifiedData, isLoading, error } = useQuery({
    queryKey: ['classified-payment', classifiedId],
    queryFn: async () => {
      console.log('Fetching classified data for payment:', classifiedId);
      const response = await apiClient.get(`/classified/${classifiedId}/customer`, { requireAuth: false });
      return response.response;
    },
    enabled: !!classifiedId && classifiedId !== ':classifiedId'
  });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  if (error || !classifiedData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Payment Form</h2>
        <p className="text-gray-600">Unable to load classified information. Please try again.</p>
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
        <ClassifiedSummaryCard classified={classifiedData.classified} />
        
        <ReactSquarePaymentCard
          billingContact={billingContact}
          billingAddress={billingAddress}
          emailValidationToken={emailValidationToken}
        />
      </div>
    </div>
  );
};

export default ClassifiedPaymentContainer;
