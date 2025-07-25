import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import EmailValidationCard from '@/components/payment/EmailValidationCard';
import PaymentInformationCard from '@/components/payment/PaymentInformationCard';
import PaymentMethodCard from '@/components/payment/PaymentMethodCard';
import { normalizePhoneForSquare } from '@/utils/phoneUtils';
import { getApiUrl } from '@/config/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, MapPin, Calendar } from 'lucide-react';

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

interface ClassifiedData {
  classifiedId: string;
  title: string;
  description: string;
  categoryId: string;
  price: number;
  perUnitType: string;
  city: string;
  state: string;
  postalCode: string;
  createDate: string;
  adTypeId: string;
}

interface CustomerData {
  firstName?: string;
  lastName?: string;
  emailAddress: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

interface PaymentData {
  classified: ClassifiedData;
  customer: CustomerData;
}

// Simple classified details card component
const ClassifiedDetailsCard = ({ classified, customer }: { classified: ClassifiedData; customer: CustomerData }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-greenyp-600" />
          Ad Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{classified.title}</h3>
          <p className="text-gray-600 mt-2">{classified.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{formatPrice(classified.price)}</span>
          {classified.perUnitType && (
            <span className="text-gray-600">per {classified.perUnitType}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">
            {classified.city}, {classified.state} {classified.postalCode}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">
            Created: {new Date(classified.createDate).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Simple payment layout component
const PaymentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">Review your ad details and complete payment to publish your classified ad.</p>
        </div>
        {children}
      </div>
    </div>
  );
};

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const classifiedId = searchParams.get('classifiedId');
  const customerId = searchParams.get('customerId');
  
  // State management
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Email validation state
  const [emailValidationToken, setEmailValidationToken] = useState('');
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Billing information state - consolidated structure
  const [billingInfo, setBillingInfo] = useState<BillingInformation>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Mock payment method card ref for PaymentMethodCard
  const cardContainerRef = React.useRef<HTMLDivElement>(null);

  // Fetch payment data
  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!classifiedId || !customerId) {
        setError('Missing required parameters');
        setIsLoading(false);
        return;
      }

      try {
        // Mock data for development - replace with actual API call
        const mockData: PaymentData = {
          classified: {
            classifiedId: classifiedId,
            title: 'Premium Hay Bales - High Quality',
            description: 'Fresh, premium quality hay bales perfect for livestock feed. Stored in dry conditions.',
            categoryId: '1',
            price: 12.50,
            perUnitType: 'Bale',
            city: 'Bakersfield',
            state: 'CA',
            postalCode: '93301',
            createDate: new Date().toISOString(),
            adTypeId: '1'
          },
          customer: {
            firstName: 'John',
            lastName: 'Doe',
            emailAddress: 'john.doe@example.com',
            phoneNumber: '555-123-4567',
            address: '123 Farm Road',
            city: 'Bakersfield',
            state: 'CA',
            postalCode: '93301'
          }
        };
        
        setPaymentData(mockData);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payment data');
        setIsLoading(false);
      }
    };

    fetchPaymentData();
  }, [classifiedId, customerId]);

  // Initialize billing info from customer data
  useEffect(() => {
    if (paymentData?.customer) {
      setBillingInfo({
        firstName: paymentData.customer.firstName || '',
        lastName: paymentData.customer.lastName || '',
        email: paymentData.customer.emailAddress || '',
        phone: paymentData.customer.phoneNumber || '',
        address: paymentData.customer.address || '',
        address2: '',
        city: paymentData.customer.city || '',
        state: paymentData.customer.state || '',
        zipCode: paymentData.customer.postalCode || ''
      });
    }
  }, [paymentData?.customer]);

  // Get the customer email for validation
  const getCustomerEmail = () => {
    return paymentData?.customer?.emailAddress || '';
  };

  // Prepare copy from ad data
  const copyFromAdData: BillingInformation | undefined = paymentData?.customer ? {
    firstName: paymentData.customer.firstName || '',
    lastName: paymentData.customer.lastName || '',
    email: paymentData.customer.emailAddress || '',
    phone: normalizePhoneForSquare(paymentData.customer.phoneNumber || ''),
    address: paymentData.customer.address || '',
    address2: '',
    city: paymentData.customer.city || '',
    state: paymentData.customer.state || '',
    zipCode: paymentData.customer.postalCode || ''
  } : undefined;

  const handleBillingInfoChange = (updatedBillingInfo: BillingInformation, emailToken: string) => {
    setBillingInfo(updatedBillingInfo);
    setEmailValidationToken(emailToken);
  };

  // Email validation handler
  const handleEmailValidated = async () => {
    if (!emailValidationToken.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a verification code",
        variant: "destructive",
      });
      return;
    }

    const emailAddress = getCustomerEmail();
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
          token: emailValidationToken.trim(),
          emailAddress: emailAddress,
          context: 'classifieds',
          classifiedId: classifiedId
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

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: "Your classified ad has been published successfully!",
      });
      navigate('/classifieds/payment-confirmation');
    }, 2000);
  };

  // Show loading state
  if (isLoading) {
    return (
      <PaymentLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Loading Payment Information</h2>
          <p className="text-gray-600">Please wait while we retrieve your ad details...</p>
        </div>
      </PaymentLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <PaymentLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Payment Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </PaymentLayout>
    );
  }

  // Show missing data error
  if (!paymentData) {
    return (
      <PaymentLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Payment Data Not Found</h2>
          <p className="text-gray-600">Unable to load payment information.</p>
        </div>
      </PaymentLayout>
    );
  }

  return (
    <PaymentLayout>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column - Classified Details */}
        <div className="space-y-6">
          <ClassifiedDetailsCard 
            classified={paymentData.classified}
            customer={paymentData.customer}
          />
        </div>

        {/* Right Column - Payment Information */}
        <div className="space-y-6">
          {/* Email Validation Card - CRITICAL COMPONENT */}
          <EmailValidationCard
            validationToken={emailValidationToken}
            onChange={setEmailValidationToken}
            emailAddress={getCustomerEmail()}
            helperText={`We have sent a confirmation email to ${getCustomerEmail()}. Please check your email and enter the token below to validate.`}
            isValidated={isEmailValidated}
            isValidating={isValidating}
            validationError={validationError}
            onValidate={handleEmailValidated}
          />

          {/* Payment Information Card - Disabled until email is validated */}
          <div className={!isEmailValidated ? "opacity-50 pointer-events-none" : ""}>
            <h3 className="text-lg font-medium mb-2">Billing Information</h3>
            <p className="text-sm text-gray-500 mb-4">
              {!isEmailValidated ? "Please validate your email address to enable this section" : "Please enter your billing information below"}
            </p>
            <PaymentInformationCard
              initialBillingInfo={billingInfo}
              onBillingInfoChange={handleBillingInfoChange}
              emailValidationToken={emailValidationToken}
              isEmailValidated={isEmailValidated}
              copyFromAdData={copyFromAdData}
              showCopyButton={true}
            />
          </div>

          {/* Payment Method Card - Disabled until email is validated */}
          <div className={!isEmailValidated ? "opacity-50 pointer-events-none" : ""}>
            <h3 className="text-lg font-medium mb-2">Payment Method</h3>
            <p className="text-sm text-gray-500 mb-4">
              {!isEmailValidated ? "Please validate your email address to enable this section" : "Please enter your payment information below"}
            </p>
            <PaymentMethodCard
              cardContainerRef={cardContainerRef}
              error={null}
              isProcessing={isProcessing}
              onPayment={handlePayment}
              isCardReady={isEmailValidated}
            />
          </div>
        </div>
      </div>
    </PaymentLayout>
  );
};

export default Payment;