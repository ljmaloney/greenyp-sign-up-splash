import React, { useState, useEffect } from 'react';
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
import { getApiUrl } from '@/config/api';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useLineOfBusiness } from '@/hooks/useLineOfBusiness';
import { findSubscriptionMatch } from '@/utils/subscriptionMatching';

const SignUpConfirmation = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Extract payment reference information that we still need from query params
  const orderRef = searchParams.get('orderRef');
  const paymentRef = searchParams.get('paymentRef');
  const receiptNumber = searchParams.get('receiptNumber');
  
  // Get the producer ID from the URL params
  const producerId = searchParams.get('producerId');
  
  // State for account data
  const [isLoading, setIsLoading] = useState(true);
  const [producer, setProducer] = useState<any>(null);
  const [primaryLocation, setPrimaryLocation] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  
  // Fetch subscriptions and line of business data
  const { data: subscriptions } = useSubscriptions();
  const { data: lineOfBusinessData } = useLineOfBusiness();

  // Find subscription details
  const selectedSubscription = findSubscriptionMatch(subscriptions, producer?.subscriptions?.[0]?.subscriptionId || null);

  // Find line of business name
  const lineOfBusinessName = lineOfBusinessData?.find(
    (lob: any) => lob.lineOfBusinessId === producer?.lineOfBusinessId
  )?.lineOfBusinessName || 'Unknown';
  
  // Get the admin contact
  const getAdminContact = () => {
    if (Array.isArray(contacts) && contacts.length > 0) {
      return contacts.find(c => c.producerContactType === 'ADMIN') || null;
    }
    return null;
  };
  
  const adminContact = getAdminContact();
  
  // Fetch producer data using producerId
  useEffect(() => {
    const fetchProducerData = async () => {
      if (!producerId) {
        setIsLoading(false);
        toast({
          title: "Missing Producer ID",
          description: "Cannot load account details without a producer ID.",
          variant: "destructive",
        });
        return;
      }

      try {
        console.log('🔍 Fetching producer data for ID:', producerId);
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
          
          if (Array.isArray(contactsData)) {
            setContacts(contactsData);
          }
        } else {
          throw new Error('Invalid data structure in response');
        }
      } catch (error) {
        console.error('❌ Error fetching producer data:', error);
        toast({
          title: "Data Retrieval Error",
          description: "Unable to load your account information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducerData();
  }, [producerId, toast]);
  
  // Get subscription price directly from API response
  const getSubscriptionPrice = () => {
    // Use the first subscription from the producer's subscriptions array (from API response)
    if (producer?.subscriptions && producer.subscriptions.length > 0) {
      const firstSubscription = producer.subscriptions[0];
      return `$${firstSubscription.subscriptionAmount}`;
    }
    // Fallback to selectedSubscription if available
    if (selectedSubscription && 'subscriptionAmount' in selectedSubscription) {
      return `$${selectedSubscription.subscriptionAmount}`;
    }
    return '$0';
  };

  // Get subscription display name
  const getSubscriptionDisplayName = () => {
    // Use the first subscription from the producer's subscriptions array (from API response)
    if (producer?.subscriptions && producer.subscriptions.length > 0) {
      const firstSubscription = producer.subscriptions[0];
      return firstSubscription.displayName;
    }
    // Fallback to selectedSubscription if available
    if (selectedSubscription?.displayName) {
      return selectedSubscription.displayName;
    }
    return 'Basic Listing';
  };
  
  // Prepare account data from the API response
  const accountData = {
    businessName: producer?.businessName || 'Your Business',
    subscriptionPlan: getSubscriptionDisplayName(),
    subscriptionPrice: getSubscriptionPrice(),
    subscriptionType: producer?.subscriptionType || 'LIVE_UNPAID',
    lineOfBusiness: lineOfBusinessName,
    email: adminContact?.emailAddress || 'Not provided',
    phone: adminContact?.phoneNumber || 'Not provided',
    location: primaryLocation ? `${primaryLocation.city}, ${primaryLocation.state}` : 'Not provided',
    website: producer?.websiteUrl || '',
    producerId: producer?.producerId || producerId || '',
    // Location details from API response
    locationName: primaryLocation?.locationName || '',
    addressLine1: primaryLocation?.addressLine1 || '',
    addressLine2: primaryLocation?.addressLine2 || '',
    city: primaryLocation?.city || '',
    state: primaryLocation?.state || '',
    postalCode: primaryLocation?.postalCode || '',
    // Contact details from API response
    contactName: adminContact ? `${adminContact.firstName} ${adminContact.lastName}` : '',
    firstName: adminContact?.firstName || '',
    lastName: adminContact?.lastName || '',
    title: adminContact?.title || '',
    cellPhone: adminContact?.cellPhoneNumber || ''
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SubscribersHeader />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Loading Account Information</h2>
              <p className="text-gray-600">Please wait while we retrieve your account details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SubscribersHeader />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <ConfirmationHeader businessName={accountData.businessName} />

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