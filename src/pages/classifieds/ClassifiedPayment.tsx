import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import EmailValidationCard from '@/components/payment/EmailValidationCard';
import PaymentInformationCard from '@/components/payment/PaymentInformationCard';
import ReactSquareCard from '@/components/payment/ReactSquareCard';
import { normalizePhoneForSquare } from '@/utils/phoneUtils';
import { getApiUrl } from '@/config/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, MapPin, Calendar } from 'lucide-react';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import Footer from '@/components/Footer';

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

// Payment layout component with header and footer
const PaymentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
            <p className="text-gray-600 mt-2">Review your ad details and complete payment to publish your classified ad.</p>
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Payment = () => {
  const [searchParams] = useSearchParams();
  const params = useParams<{ classifiedId?: string }>(); // Extract path parameter
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get classifiedId from either path parameter or query parameter
  const classifiedId = params.classifiedId || searchParams.get('classifiedId');
  const customerId = searchParams.get('customerId');
  
  console.log('🌐 URL Parameters:', { pathParam: params.classifiedId, queryParam: searchParams.get('classifiedId'), finalId: classifiedId });
  
  // State management
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Reference to track if data has been fetched to prevent infinite loops
  const dataFetchedRef = useRef(false);

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

  // Removed payment method card ref as we're using ReactSquareCard directly

  // Fetch payment data once
  useEffect(() => {
    // Skip if we've already fetched data or don't have a classifiedId
    if (dataFetchedRef.current || !classifiedId) {
      if (!classifiedId) {
        setError('Classified ID is required');
        setIsLoading(false);
      }
      return;
    }
    
    // Mark data as being fetched to prevent multiple fetches
    dataFetchedRef.current = true;
    
    const fetchPaymentData = async () => {
      
      try {
        // Fetch data from the correct API endpoint
        console.log('🔍 Fetching classified data from:', getApiUrl(`/classified/${classifiedId}/customer`));
        const response = await fetch(getApiUrl(`/classified/${classifiedId}/customer`));
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.errorMessageApi?.displayMessage || 'Failed to fetch classified data');
        }
        
        // Check if response has the expected structure
        if (data.response && data.response.classified && data.response.customer) {
          console.log('✅ Classified data retrieved:', data.response);
          
          // Set payment data from the API response
          setPaymentData({
            classified: data.response.classified,
            customer: data.response.customer
          });
        } else {
          throw new Error('Invalid response format from classified API');
        }
      } catch (err) {
        console.error('❌ Error fetching classified data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load payment data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentData();
  }, [classifiedId]); // Only depend on classifiedId to prevent infinite loops

  // Prepare copy from ad data for the PaymentInformationCard component
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
  
  // Initialize billing info from customer data (optional if you want to pre-fill)
  useEffect(() => {
    if (paymentData?.customer) {
      // Only initialize if billing info is empty
      if (!billingInfo.firstName && !billingInfo.lastName && !billingInfo.email) {
        setBillingInfo({
          firstName: paymentData.customer.firstName || '',
          lastName: paymentData.customer.lastName || '',
          email: paymentData.customer.emailAddress || '',
          phone: normalizePhoneForSquare(paymentData.customer.phoneNumber || ''),
          address: paymentData.customer.address || '',
          address2: '',
          city: paymentData.customer.city || '',
          state: paymentData.customer.state || '',
          zipCode: paymentData.customer.postalCode || ''
        });
      }
    }
  }, [paymentData?.customer]);

  // Get the customer email for validation
  const getCustomerEmail = () => {
    return paymentData?.customer?.emailAddress || '';
  };

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
          externRef: classifiedId, // Use classifiedId as externRef as requested
          token: emailValidationToken.trim(),
          emailAddress: emailAddress
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

  // Function to process the Square payment - receives token from ReactSquareCard
  const processSquarePayment = async (tokenData: any) => {
    setIsProcessing(true);
    
    if (!classifiedId || !paymentData) {
      toast({
        title: "Error",
        description: "Missing classified information",
        variant: "destructive"
      });
      setIsProcessing(false);
      return null;
    }
    
    console.log('💳 Payment token received from Square:', tokenData);
    
    try {
      // Create the payload for the /classified/payment endpoint
      const paymentPayload = {
        // Map producerId to referenceId as per requirements
        referenceId: classifiedId,
        paymentToken: tokenData.token,
        verificationToken: tokenData.verificationToken || '',
        emailValidationToken: emailValidationToken,
        
        // Contact information from billing info
        firstName: billingInfo.firstName,
        lastName: billingInfo.lastName,
        emailAddress: billingInfo.email,
        phoneNumber: billingInfo.phone,
        
        // Address information
        addressLine1: billingInfo.address,
        addressLine2: billingInfo.address2,
        city: billingInfo.city,
        state: billingInfo.state,
        postalCode: billingInfo.zipCode
      };
      
      console.log('💳 Submitting payment to /classified/payment:', paymentPayload);
      
      // Make the API call to the payment endpoint
      const response = await fetch(getApiUrl('/classified/payment'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentPayload)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.errorMessageApi?.displayMessage || 'Payment processing failed');
      }
      
      console.log('✅ Payment successful:', responseData);
      
      toast({
        title: "Payment Successful",
        description: "Your classified ad has been published successfully!",
      });
      
      // Extract payment details from the response
      const paymentDetails = responseData.response || {};
      const { paymentRef, orderRef, receiptNumber } = paymentDetails;
      
      // Navigate to confirmation page with the classifiedId in the path parameter
      // and additional payment details as query parameters
      navigate(`/classifieds/payment/confirmation/${classifiedId}?paymentSuccess=true&paymentRef=${paymentRef || ''}&orderRef=${orderRef || ''}&receiptNumber=${receiptNumber || ''}`, {
        state: { paymentDetails }
      });
      return responseData;
    } catch (error) {
      console.error('❌ Payment error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : 'An error occurred during payment',
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // handlePayment function removed as ReactSquareCard handles the payment token generation
  // and directly calls processSquarePayment with the token data

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
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <ReactSquareCard
                  billingContact={{
                    firstName: billingInfo.firstName,
                    lastName: billingInfo.lastName,
                    email: billingInfo.email,
                    phone: billingInfo.phone
                  }}
                  billingAddress={{
                    address: billingInfo.address,
                    city: billingInfo.city,
                    state: billingInfo.state,
                    zipCode: billingInfo.zipCode
                  }}
                  onPaymentSuccess={processSquarePayment}
                  onPaymentError={(errorMessage) => {
                    console.error('Payment error:', errorMessage);
                    toast({
                      title: "Payment Error",
                      description: errorMessage,
                      variant: "destructive",
                    });
                  }}
                  isProcessing={isProcessing}
                  disabled={!isEmailValidated}
                  paymentType="CLASSIFIED"
                  buttonText="Pay for Classified"
                  error={null}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PaymentLayout>
  );
};

export default Payment;