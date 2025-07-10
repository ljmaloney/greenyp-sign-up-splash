
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
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
import { useClassifiedCategories } from '@/hooks/useClassifiedCategories';

const ClassifiedDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { data: classified, isLoading, error } = useClassifiedDetail(id!);
  const { data: classifiedImages = [], isLoading: imagesLoading } = useClassifiedImages(id!, !!classified);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const { data: adPackagesData } = useAdPackages();
  const { data: categoriesData } = useClassifiedCategories();

  // Safari-safe back navigation handling
  const getBackNavigation = () => {
    try {
      // Check if we came from search results
      const referrer = document.referrer || '';
      const isFromSearch = referrer.includes('/classifieds/search') || location.state?.from === 'search';
      
      // Check if there are search parameters in the current URL that indicate search context
      const hasSearchContext = searchParams.get('fromSearch') === 'true';
      
      if (isFromSearch || hasSearchContext) {
        // Try to reconstruct the search URL from stored parameters or referrer
        const storedSearchParams = sessionStorage?.getItem('lastSearchParams');
        if (storedSearchParams) {
          return {
            backUrl: `/classifieds/search?${storedSearchParams}`,
            backLabel: 'Back to Search Results'
          };
        }
        // Fallback to generic search page
        return {
          backUrl: '/classifieds/search',
          backLabel: 'Back to Search Results'
        };
      }
    } catch (error) {
      console.warn('⚠️ Safari storage access issue:', error);
    }
    
    // Default back to main classifieds page
    return {
      backUrl: '/classifieds',
      backLabel: 'Back to Classifieds'
    };
  };

  const { backUrl, backLabel } = getBackNavigation();

  // Safari-safe secret parameter handling
  useEffect(() => {
    try {
      const secret = searchParams.get('secret');
      if (secret) {
        console.log('🔑 Secret parameter detected, saving temporarily:', secret);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('classifiedSecret', secret);
        }
        // Safari-safe URL parameter removal
        const newSearchParams = new URLSearchParams();
        for (const [key, value] of searchParams.entries()) {
          if (key !== 'secret') {
            newSearchParams.set(key, value);
          }
        }
        setSearchParams(newSearchParams, { replace: true });
      }
    } catch (error) {
      console.warn('⚠️ Safari parameter handling issue:', error);
    }
  }, [searchParams, setSearchParams]);

  // Safari-safe payment success parameter handling
  useEffect(() => {
    try {
      const paymentSuccess = searchParams.get('paymentSuccess');
      console.log('🎯 ClassifiedDetail - Checking for paymentSuccess parameter:', {
        paymentSuccess,
        allSearchParams: Object.fromEntries(searchParams.entries()),
        currentUrl: window.location.href
      });
      
      if (paymentSuccess === 'true') {
        console.log('✅ Payment success detected, showing banner');
        setShowSuccessBanner(true);
        // Safari-safe parameter removal
        const newSearchParams = new URLSearchParams();
        for (const [key, value] of searchParams.entries()) {
          if (key !== 'paymentSuccess') {
            newSearchParams.set(key, value);
          }
        }
        setSearchParams(newSearchParams, { replace: true });
      } else {
        console.log('❌ No payment success parameter found');
      }
    } catch (error) {
      console.warn('⚠️ Safari payment parameter handling issue:', error);
    }
  }, [searchParams, setSearchParams]);

  // Find the ad package for this classified
  const adPackage = adPackagesData?.response?.find(pkg => pkg.adTypeId === classified?.pricingTier);
  
  // Find the category name from the categories list using the categoryId
  const categoryName = categoriesData?.response?.find(cat => cat.categoryId === classified?.category)?.name;
  
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
      // Safari-safe mailto handling
      try {
        const mailtoUrl = `mailto:${classified?.email}`;
        if (window.open) {
          window.open(mailtoUrl, '_blank');
        } else {
          window.location.href = mailtoUrl;
        }
      } catch (error) {
        console.warn('⚠️ Safari mailto issue:', error);
        window.location.href = `mailto:${classified?.email}`;
      }
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
              <ClassifiedDetailHeader 
                classified={classified}
                categoryName={categoryName}
                price={classified.price}
                backUrl={backUrl}
                backLabel={backLabel}
              />
              
              <div className="px-6 pb-8">
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
