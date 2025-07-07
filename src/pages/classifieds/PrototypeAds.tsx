
import React, { useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import PrototypeAdCard from '@/components/classifieds/PrototypeAdCard';
import PrototypeAdDetail from '@/components/classifieds/PrototypeAdDetail';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Classified } from '@/types/classifieds';
import { useAdPackages } from '@/hooks/useAdPackages';

const PrototypeAds = () => {
  const { data: adPackagesData, isLoading } = useAdPackages();
  const [selectedTierId, setSelectedTierId] = useState<string>('basic-001');

  const prototypeAds: Record<string, Classified> = {
    'basic-001': {
      id: 'proto-basic',
      title: 'Organic Tomato Seeds - Heirloom Varieties',
      description: 'Fresh heirloom tomato seeds from my garden. Cherokee Purple, Brandywine, and Green Zebra varieties available. $3 per packet, minimum 5 packets. Seeds were harvested this season and properly dried. Perfect germination rate. Great for organic gardeners who want to grow their own food.',
      category: 'Seeds & Plants',
      zipCode: '30309',
      email: 'gardener@email.com',
      phone: '(404) 555-1234',
      images: [],
      pricingTier: 'basic-001',
      contactObfuscated: false,
      createdAt: '2024-01-20T14:30:00Z',
      expiresAt: '2024-02-20T14:30:00Z'
    },
    'standard-002': {
      id: 'proto-standard',
      title: 'Professional Lawn Mower - Barely Used',
      description: 'Commercial grade zero-turn mower, 54-inch cutting deck. Used for only one season on my property. Features include hydrostatic transmission, comfortable operator seat, and powerful 25HP engine. Excellent condition with all maintenance records. Perfect for landscaping professionals or large property owners. Includes extra blades and owner\'s manual.',
      category: 'Lawn Equipment',
      zipCode: '30305',
      email: 'seller@email.com',
      phone: '(770) 555-5678',
      images: [
        'https://images.unsplash.com/photo-1558618666-9c5e22e6203c?w=500',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'
      ],
      pricingTier: 'standard-002',
      contactObfuscated: true,
      createdAt: '2024-01-18T09:15:00Z',
      expiresAt: '2024-02-18T09:15:00Z'
    },
    'premium-003': {
      id: 'proto-premium',
      title: 'Complete Landscape Design & Installation Service',
      description: 'Full-service landscape architecture and installation company with 20+ years experience. We specialize in sustainable garden designs, native plant installations, and water-efficient irrigation systems. Our team includes certified arborists and landscape architects. Services include design consultation, 3D rendering, plant selection, hardscape installation, and ongoing maintenance packages. Licensed, bonded, and insured with excellent references available.',
      category: 'Landscaping Services',
      zipCode: '30308',
      email: 'info@landscapecompany.com',
      phone: '(404) 555-9999',
      images: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
        'https://images.unsplash.com/photo-1416431168657-a6c4f5c24e33?w=500',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500',
        'https://images.unsplash.com/photo-1558618666-9c5e22e6203c?w=500',
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'
      ],
      pricingTier: 'premium-003',
      contactObfuscated: true,
      createdAt: '2024-01-16T11:45:00Z',
      expiresAt: '2024-02-16T11:45:00Z'
    }
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  const selectedAd = prototypeAds[selectedTierId];
  const selectedPackage = adPackagesData?.response?.find(pkg => pkg.adTypeId === selectedTierId);

  // If no ad is found for the selected tier, show error
  if (!selectedAd) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center text-red-600">Error: Ad prototype not found</div>
          </div>
        </main>
        <ClassifiedsFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/classifieds">
              <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Classifieds
              </Button>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Ad Package:</span>
              <Select value={selectedTierId} onValueChange={setSelectedTierId}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {adPackagesData?.response?.filter(pkg => pkg.active).map(pkg => (
                    <SelectItem key={pkg.adTypeId} value={pkg.adTypeId}>
                      {pkg.adTypeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedPackage?.adTypeName} Ad Sample Preview
            </h1>
            <p className="text-gray-600">
              Preview how your ad will look with the <strong>{selectedPackage?.adTypeName}</strong> tier (${selectedPackage?.monthlyPrice}/month)
            </p>
          </div>

          {/* Package Information - Moved to top */}
          {selectedPackage && (
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
          )}

          {/* Ad Card Preview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Card View (as seen in listings)</h2>
            <PrototypeAdCard classified={selectedAd} />
          </div>

          {/* Detailed View Preview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Detailed View (full ad page)</h2>
            <PrototypeAdDetail classified={selectedAd} />
          </div>
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default PrototypeAds;
