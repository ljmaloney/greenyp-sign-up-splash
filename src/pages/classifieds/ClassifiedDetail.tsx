
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import ContactSellerDialog from '@/components/classifieds/ContactSellerDialog';
import PaymentSuccessBanner from '@/components/classifieds/PaymentSuccessBanner';
import ClassifiedDetailHeader from '@/components/classifieds/ClassifiedDetailHeader';
import ClassifiedImageGallery from '@/components/classifieds/ClassifiedImageGallery';
import ClassifiedDescription from '@/components/classifieds/ClassifiedDescription';
import ClassifiedContactInfo from '@/components/classifieds/ClassifiedContactInfo';
import ClassifiedDetailLoading from '@/components/classifieds/ClassifiedDetailLoading';
import ClassifiedDetailError from '@/components/classifieds/ClassifiedDetailError';
import { useClassifiedDetail } from '@/hooks/useClassifiedDetail';
import { useClassifiedImages } from '@/hooks/useClassifiedImages';
import { useAdPackages } from '@/hooks/useAdPackages';

const ClassifiedDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: classified, isLoading, error } = useClassifiedDetail(id!);
  const { data: classifiedImages = [], isLoading: imagesLoading } = useClassifiedImages(id!, !!classified);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const { data: adPackagesData } = useAdPackages();

  // Handle secret parameter and save it temporarily
  useEffect(() => {
    const secret = searchParams.get('secret');
    if (secret) {
      console.log('🔑 Secret parameter detected, saving temporarily:', secret);
      localStorage.setItem('classifiedSecret', secret);
      // Remove the secret from URL for security
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('secret');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Check for payment success parameter in URL
  useEffect(() => {
    const paymentSuccess = searchParams.get('paymentSuccess');
    console.log('🎯 ClassifiedDetail - Checking for paymentSuccess parameter:', {
      paymentSuccess,
      allSearchParams: Object.fromEntries(searchParams.entries()),
      currentUrl: window.location.href
    });
    
    if (paymentSuccess === 'true') {
      console.log('✅ Payment success detected, showing banner');
      setShowSuccessBanner(true);
      // Remove the parameter from URL without triggering a navigation
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('paymentSuccess');
      setSearchParams(newSearchParams, { replace: true });
    } else {
      console.log('❌ No payment success parameter found');
    }
  }, [searchParams, setSearchParams]);

  // Find the ad package for this classified
  const adPackage = adPackagesData?.response?.find(pkg => pkg.adTypeId === classified?.pricingTier);
  
  // Check if contact should be protected - either by ad package feature OR if contact is obfuscated
  const hasProtectedContact = (adPackage?.features?.protectContact || classified?.contactObfuscated) || false;

  console.log('🔍 Contact protection check:', {
    classifiedId: classified?.id,
    pricingTier: classified?.pricingTier,
    contactObfuscated: classified?.contactObfuscated,
    adPackageProtectContact: adPackage?.features?.protectContact,
    hasProtectedContact
  });

  const handleContactSeller = () => {
    console.log('📧 Send Email clicked:', {
      hasProtectedContact,
      classifiedId: classified?.id,
      contactObfuscated: classified?.contactObfuscated
    });
    
    if (hasProtectedContact) {
      console.log('🛡️ Showing contact dialog for protected contact');
      setShowContactDialog(true);
    } else {
      console.log('📬 Opening email client directly');
      window.open(`mailto:${classified?.email}`, '_blank');
    }
  };

  const handleDismissSuccessBanner = () => {
    console.log('🚫 Dismissing success banner');
    setShowSuccessBanner(false);
  };

  if (isLoading) {
    return <ClassifiedDetailLoading />;
  }

  if (error || !classified) {
    return <ClassifiedDetailError />;
  }

  // Combine classified images with fallback to classified.images array
  const displayImages = classifiedImages.length > 0 
    ? classifiedImages.map(img => img.url) 
    : classified.images || [];

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {showSuccessBanner && (
              <PaymentSuccessBanner onDismiss={handleDismissSuccessBanner} />
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ClassifiedDetailHeader classified={classified} />
              
              <div className="px-6">
                <ClassifiedImageGallery 
                  images={displayImages} 
                  title={classified.title}
                />
                
                <ClassifiedDescription description={classified.description} />
                
                <ClassifiedContactInfo
                  classified={classified}
                  hasProtectedContact={hasProtectedContact}
                  onContactSeller={handleContactSeller}
                />
              </div>
            </div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>

      <ContactSellerDialog
        isOpen={showContactDialog}
        onOpenChange={setShowContactDialog}
        classified={classified}
      />
    </>
  );
};

export default ClassifiedDetail;
