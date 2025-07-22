import React from 'react';
import { useSearchParams } from 'react-router-dom';
import SubscribersHeader from '@/components/SubscribersHeader';
import Footer from '@/components/Footer';
import ConfirmationHeader from '@/components/signup/confirmation/ConfirmationHeader';
import AccountSummaryCard from '@/components/signup/confirmation/AccountSummaryCard';
import ListingDetailsCard from '@/components/signup/confirmation/ListingDetailsCard';
import PaymentReferenceCard from '@/components/signup/confirmation/PaymentReferenceCard';
import NextStepsCard from '@/components/signup/confirmation/NextStepsCard';
import ConfirmationActions from '@/components/signup/confirmation/ConfirmationActions';
import SupportSection from '@/components/signup/confirmation/SupportSection';

const SignUpConfirmation = () => {
  const [searchParams] = useSearchParams();
  
  // Extract payment reference information
  const orderRef = searchParams.get('orderRef');
  const paymentRef = searchParams.get('paymentRef');
  const receiptNumber = searchParams.get('receiptNumber');
  
  const accountData = {
    businessName: searchParams.get('businessName') || 'Your Business',
    subscriptionPlan: searchParams.get('plan') || 'Basic Listing',
    subscriptionPrice: searchParams.get('planPrice') || '$5',
    subscriptionType: searchParams.get('subscriptionType') || 'LIVE_UNPAID',
    lineOfBusiness: searchParams.get('lineOfBusiness') || 'Business Category',
    email: searchParams.get('email') || 'your@email.com',
    phone: searchParams.get('phone') || '(555) 123-4567',
    location: searchParams.get('location') || 'Your City, State',
    website: searchParams.get('website') || '',
    producerId: searchParams.get('producerId') || 'GYP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    // Location details from API response
    locationName: searchParams.get('locationName') || '',
    addressLine1: searchParams.get('addressLine1') || '',
    addressLine2: searchParams.get('addressLine2') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    postalCode: searchParams.get('postalCode') || '',
    // Contact details from API response
    contactName: searchParams.get('contactName') || '',
    firstName: searchParams.get('firstName') || '',
    lastName: searchParams.get('lastName') || '',
    title: searchParams.get('title') || '',
    cellPhone: searchParams.get('cellPhone') || ''
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SubscribersHeader />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <ConfirmationHeader />

          {/* Payment Reference Information - Show first if payment was successful */}
          {(orderRef || paymentRef || receiptNumber) && (
            <div className="mb-8">
              <PaymentReferenceCard
                orderRef={orderRef || undefined}
                paymentRef={paymentRef || undefined}
                receiptNumber={receiptNumber || undefined}
              />
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            <AccountSummaryCard
              businessName={accountData.businessName}
              lineOfBusiness={accountData.lineOfBusiness}
              subscriptionPlan={accountData.subscriptionPlan}
              subscriptionPrice={accountData.subscriptionPrice}
              subscriptionType={accountData.subscriptionType}
              producerId={accountData.producerId}
            />

            <ListingDetailsCard
              contactName={accountData.contactName}
              firstName={accountData.firstName}
              lastName={accountData.lastName}
              title={accountData.title}
              email={accountData.email}
              phone={accountData.phone}
              cellPhone={accountData.cellPhone}
              locationName={accountData.locationName}
              addressLine1={accountData.addressLine1}
              addressLine2={accountData.addressLine2}
              city={accountData.city}
              state={accountData.state}
              postalCode={accountData.postalCode}
              website={accountData.website}
            />
          </div>

          <NextStepsCard />
          <ConfirmationActions />
          <SupportSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpConfirmation;
