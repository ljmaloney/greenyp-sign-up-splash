import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import ContactSellerDialog from '@/components/classifieds/ContactSellerDialog';
import PaymentSuccessBanner from '@/components/classifieds/PaymentSuccessBanner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, Mail, Phone, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useClassifiedDetail } from '@/hooks/useClassifiedDetail';
import { useAdPackages } from '@/hooks/useAdPackages';

const ClassifiedDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: classified, isLoading, error } = useClassifiedDetail(id!);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const { data: adPackagesData } = useAdPackages();

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

  const formatContact = (contact: string, type: 'email' | 'phone') => {
    if (!classified?.contactObfuscated) {
      return contact;
    }
    
    if (type === 'email') {
      const [username, domain] = contact.split('@');
      return `${username.slice(0, 2)}***@${domain}`;
    } else {
      return `${contact.slice(0, 3)}***${contact.slice(-4)}`;
    }
  };

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
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  if (error || !classified) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ad Not Found</h2>
              <p className="text-gray-600 mb-6">The classified ad you're looking for doesn't exist or has been removed.</p>
              <Link to="/classifieds">
                <Button className="bg-greenyp-600 hover:bg-greenyp-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Classifieds
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-6">
              <Link to="/classifieds">
                <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Classifieds
                </Button>
              </Link>
            </div>

            {showSuccessBanner && (
              <PaymentSuccessBanner onDismiss={handleDismissSuccessBanner} />
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 text-center flex-1">{classified.title}</h1>
                  <Badge variant="secondary" className="ml-4">{classified.category}</Badge>
                </div>

                <div className="flex items-center text-gray-500 space-x-6 mb-6">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-greenyp-600" />
                    <span>{classified.zipCode}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-greenyp-600" />
                    <span>Posted {format(new Date(classified.createdAt), 'MMMM dd, yyyy')}</span>
                  </div>
                </div>

                {classified.images.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Photos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {classified.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${classified.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                            onClick={() => window.open(image, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Description</h3>
                  <div className="text-gray-700 text-left whitespace-pre-wrap leading-relaxed">
                    {classified.description}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-greenyp-600" />
                      <span className="text-gray-700">
                        {formatContact(classified.email, 'email')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-greenyp-600" />
                      <span className="text-gray-700">
                        {formatContact(classified.phone, 'phone')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Button 
                      className="bg-greenyp-600 hover:bg-greenyp-700 flex-1"
                      onClick={handleContactSeller}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50 flex-1"
                      onClick={() => window.open(`tel:${classified.phone}`, '_blank')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </div>
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
