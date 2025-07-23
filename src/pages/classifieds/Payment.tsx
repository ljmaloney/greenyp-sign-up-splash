
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import { useClassifiedDetail } from '@/hooks/useClassifiedDetail';
import { useAdPackages } from '@/hooks/useAdPackages';
import { useToast } from '@/hooks/use-toast';
import ClassifiedPaymentSummary from '@/components/classifieds/ClassifiedPaymentSummary';
import ClassifiedAdThumbnail from '@/components/classifieds/ClassifiedAdThumbnail';
import EmailValidationCard from '@/components/classifieds/EmailValidationCard';
import BillingInformationCard from '@/components/classifieds/BillingInformationCard';
import SquarePaymentCard from '@/components/classifieds/SquarePaymentCard';

const Payment = () => {
  const { classifiedId } = useParams<{ classifiedId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [emailValidationToken, setEmailValidationToken] = useState('');
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: ''
  });
  const [isBillingComplete, setIsBillingComplete] = useState(false);

  const { data: classified, isLoading: classifiedLoading, error: classifiedError } = useClassifiedDetail(classifiedId || '');
  const { data: adPackagesResponse, isLoading: packagesLoading } = useAdPackages();

  if (classifiedLoading || packagesLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-lg">Loading payment details...</div>
        </div>
        <ClassifiedsFooter />
      </div>
    );
  }

  if (classifiedError || !classified) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-lg text-red-600">Failed to load classified ad details</div>
        </div>
        <ClassifiedsFooter />
      </div>
    );
  }

  const adPackages = adPackagesResponse?.response || [];
  const selectedPackage = adPackages.find(pkg => pkg.adTypeId === classified.pricingTier);

  const handleEmailValidationSuccess = (token: string) => {
    setEmailValidationToken(token);
    setIsEmailValidated(true);
    toast({
      title: "Email Validated",
      description: "Email validation successful. You can now proceed with billing information.",
    });
  };

  const handleBillingInfoChange = (info: any) => {
    setBillingInfo(info);
    const isComplete = info.firstName && info.lastName && info.address && 
                      info.city && info.state && info.zipCode && info.phone && info.email;
    setIsBillingComplete(isComplete);
  };

  const handlePaymentSuccess = (result: any) => {
    toast({
      title: "Payment Successful",
      description: "Your classified ad has been published successfully!",
    });
    navigate('/classifieds');
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
            <p className="text-gray-600 mt-2">Finalize your classified ad purchase</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {selectedPackage && (
                <ClassifiedPaymentSummary 
                  classified={classified}
                  adPackage={selectedPackage}
                />
              )}
              <ClassifiedAdThumbnail classified={classified} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <EmailValidationCard
                classifiedId={classifiedId || ''}
                emailAddress={classified.email}
                onValidationSuccess={handleEmailValidationSuccess}
              />
              
              <BillingInformationCard
                classified={classified}
                isEnabled={isEmailValidated}
                onBillingInfoChange={handleBillingInfoChange}
              />
              
              <SquarePaymentCard
                classifiedId={classifiedId || ''}
                emailValidationToken={emailValidationToken}
                billingInfo={billingInfo}
                isEnabled={isEmailValidated && isBillingComplete}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                onCancel={() => navigate('/classifieds')}
              />
            </div>
          </div>
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default Payment;
