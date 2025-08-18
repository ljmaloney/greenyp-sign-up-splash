import React, { useState, useEffect } from 'react';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import PrototypeAdCard from '@/components/classifieds/PrototypeAdCard';
import PrototypeAdDetail from '@/components/classifieds/PrototypeAdDetail';
import AdPackageSelector from '@/components/classifieds/AdPackageSelector';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Classified } from '@/types/classifieds';
import { useAdPackages } from '@/hooks/classifieds/useAdPackages';

const Samples = () => {
  const navigate = useNavigate();
  const { data: adPackagesData, isLoading } = useAdPackages();
  const [selectedTierId, setSelectedTierId] = useState<string>('');

  console.log('Samples component:', { adPackagesData, selectedTierId, isLoading });

  // Set default tier based on defaultPackage property
  useEffect(() => {
    if (adPackagesData?.response && !selectedTierId) {
      console.log('Available packages:', adPackagesData.response);
      const defaultPackage = adPackagesData.response.find(pkg => pkg.defaultPackage && pkg.active);
      if (defaultPackage) {
        console.log('Found default package:', defaultPackage);
        setSelectedTierId(defaultPackage.adTypeId);
      } else {
        // Fallback to first active package if no default is found
        const firstActivePackage = adPackagesData.response.find(pkg => pkg.active);
        if (firstActivePackage) {
          console.log('Using first active package as fallback:', firstActivePackage);
          setSelectedTierId(firstActivePackage.adTypeId);
        }
      }
    }
  }, [adPackagesData, selectedTierId]);

  // Map ad package names to prototype ads
  const getPrototypeAdByPackageName = (packageName: string): Classified => {
    console.log('Getting prototype for package:', packageName);
    const prototypeAdsMap: Record<string, Classified> = {
      'Basic': {
        id: 'proto-basic',
        title: 'Organic Tomato Seeds - Heirloom Varieties',
        description: 'Fresh heirloom tomato seeds from my garden. Cherokee Purple, Brandywine, and Green Zebra varieties available. $3 per packet, minimum 5 packets. Seeds were harvested this season and properly dried. Perfect germination rate. Great for organic gardeners who want to grow their own food.',
        category: 'Seeds & Plants',
        zipCode: '30309',
        email: 'gardener@email.com',
        phone: '(404) 555-1234',
        images: [],
        pricingTier: selectedTierId,
        contactObfuscated: false,
        createdAt: '2024-01-20T14:30:00Z',
        expiresAt: '2024-02-20T14:30:00Z'
      },
      'Standard': {
        id: 'proto-standard',
        title: 'Professional Lawn Mower - Barely Used',
        description: 'Commercial grade zero-turn mower, 54-inch cutting deck. Used for only one season on my property. Features include hydrostatic transmission, comfortable operator seat, and powerful 25HP engine. Excellent condition with all maintenance records. Perfect for landscaping professionals or large property owners. Includes extra blades and owner\'s manual.',
        category: 'Lawn Equipment',
        zipCode: '30305',
        email: 'seller@email.com',
        phone: '(770) 555-5678',
        images: [
          'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=400&fit=crop',
          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=400&fit=crop',
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=400&fit=crop'
        ],
        pricingTier: selectedTierId,
        contactObfuscated: true,
        createdAt: '2024-01-18T09:15:00Z',
        expiresAt: '2024-02-18T09:15:00Z'
      },
      'Enhanced': {
        id: 'proto-enhanced',
        title: 'Complete Landscape Design & Installation Service',
        description: 'Full-service landscape architecture and installation company with 20+ years experience. We specialize in sustainable garden designs, native plant installations, and water-efficient irrigation systems. Our team includes certified arborists and landscape architects. Services include design consultation, 3D rendering, plant selection, hardscape installation, and ongoing maintenance packages. Licensed, bonded, and insured with excellent references available.',
        category: 'Landscaping Services',
        zipCode: '30308',
        email: 'info@landscapecompany.com',
        phone: '(404) 555-9999',
        images: [
          'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=400&fit=crop',
          'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=400&fit=crop',
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=400&fit=crop',
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=400&fit=crop',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=400&fit=crop'
        ],
        pricingTier: selectedTierId,
        contactObfuscated: true,
        createdAt: '2024-01-16T11:45:00Z',
        expiresAt: '2024-02-16T11:45:00Z'
      }
    };

    return prototypeAdsMap[packageName];
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  const activePackages = adPackagesData?.response?.filter(pkg => pkg.active) || [];
  const selectedPackage = activePackages.find(pkg => pkg.adTypeId === selectedTierId);
  
  console.log('Selected package info:', { selectedPackage, selectedTierId, activePackages });
  
  const selectedAd = selectedPackage ? getPrototypeAdByPackageName(selectedPackage.adTypeName) : null;

  console.log('Selected ad:', selectedAd);

  const handleCreateAdNow = () => {
    navigate('/classifieds/create', {
      state: {
        preSelectedPackage: selectedTierId
      }
    });
  };

  // If no packages are available
  if (!activePackages.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center text-red-600">No ad packages available</div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  // If no tier is selected yet, show loading
  if (!selectedTierId) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center">Loading packages...</div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  // If no ad is found for the selected tier, show error
  if (!selectedAd || !selectedPackage) {
    console.error('Ad prototype not found:', { selectedPackage, selectedTierId, selectedAd });
    return (
      <div className="min-h-screen flex flex-col">
        <ClassifiedsHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center text-red-600">Error: Ad prototype not found for selected package</div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6 flex items-center">
            <Link to="/classifieds">
              <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Classifieds
              </Button>
            </Link>
          </div>

          {/* Package Selection - Using card-based selector */}
          <div className="mb-8">
            <AdPackageSelector
              adPackages={activePackages}
              selectedAdType={selectedTierId}
              onAdTypeChange={setSelectedTierId}
            />
          </div>

          {/* Package Information */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{selectedPackage.adTypeName} Package Features</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Price: ${selectedPackage.monthlyPrice}/month</li>
              <li>• Maximum Images: {selectedPackage.features.maxImages}</li>
              <li>• Contact Privacy: {selectedPackage.features.protectContact ? 'Yes' : 'No'}</li>
              {selectedPackage.features.features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Preview how your ad will appear with the <strong className="text-greenyp-600">{selectedPackage.adTypeName}</strong> package (${selectedPackage.monthlyPrice}/month)
            </h1>
          </div>

          {/* Ad Card Preview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Card View (as seen in listings)</h2>
            <PrototypeAdCard classified={selectedAd} />
          </div>

          {/* Detailed View Preview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Detailed View (full ad page)</h2>
            <PrototypeAdDetail classified={selectedAd} />
          </div>

          {/* Create Ad Now Button */}
          <div className="mb-8 text-center">
            <Button
              onClick={handleCreateAdNow}
              size="lg"
              className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-8 py-3 text-lg"
            >
              Create my ad now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default Samples;
