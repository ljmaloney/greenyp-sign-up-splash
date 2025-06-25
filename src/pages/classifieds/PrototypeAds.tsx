
import React, { useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, Calendar, Mail, Phone, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Classified, PRICING_TIERS } from '@/types/classifieds';

const PrototypeAds = () => {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>('basic');

  const prototypeAds: Record<'basic' | 'standard' | 'premium', Classified> = {
    basic: {
      id: 'proto-basic',
      title: 'Organic Tomato Seeds - Heirloom Varieties',
      description: 'Fresh heirloom tomato seeds from my garden. Cherokee Purple, Brandywine, and Green Zebra varieties available. $3 per packet, minimum 5 packets. Seeds were harvested this season and properly dried. Perfect germination rate. Great for organic gardeners who want to grow their own food.',
      category: 'Seeds & Plants',
      zipCode: '30309',
      email: 'gardener@email.com',
      phone: '(404) 555-1234',
      images: [],
      pricingTier: 'basic',
      contactObfuscated: false,
      createdAt: '2024-01-20T14:30:00Z',
      expiresAt: '2024-02-20T14:30:00Z'
    },
    standard: {
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
      pricingTier: 'standard',
      contactObfuscated: false,
      createdAt: '2024-01-18T09:15:00Z',
      expiresAt: '2024-02-18T09:15:00Z'
    },
    premium: {
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
      pricingTier: 'premium',
      contactObfuscated: true,
      createdAt: '2024-01-16T11:45:00Z',
      expiresAt: '2024-02-16T11:45:00Z'
    }
  };

  const selectedAd = prototypeAds[selectedTier];
  const selectedPricing = PRICING_TIERS[selectedTier];

  const formatContact = (contact: string, type: 'email' | 'phone') => {
    if (!selectedAd.contactObfuscated) {
      return contact;
    }
    
    if (type === 'email') {
      const [username, domain] = contact.split('@');
      return `${username.slice(0, 2)}***@${domain}`;
    } else {
      return `${contact.slice(0, 3)}***${contact.slice(-4)}`;
    }
  };

  // Mock location data based on zip code
  const getLocationInfo = (zipCode: string) => {
    const locationMap: Record<string, { city: string; state: string }> = {
      '30309': { city: 'Atlanta', state: 'Georgia' },
      '30305': { city: 'Atlanta', state: 'Georgia' },
      '30308': { city: 'Atlanta', state: 'Georgia' }
    };
    return locationMap[zipCode] || { city: 'Atlanta', state: 'Georgia' };
  };

  const location = getLocationInfo(selectedAd.zipCode);

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
              <span className="text-sm font-medium">Pricing Tier:</span>
              <Select value={selectedTier} onValueChange={(value: 'basic' | 'standard' | 'premium') => setSelectedTier(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Prototype Ad Preview</h1>
            <p className="text-gray-600">
              Preview how your ad will look with the <strong>{selectedPricing.name}</strong> tier (${selectedPricing.price}/month)
            </p>
          </div>

          {/* Ad Card Preview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Card View (as seen in listings)</h2>
            <div className="flex justify-center">
              <div className="max-w-md w-full">
                <Card className="hover:shadow-md hover:border-yellow-500 transition-all duration-200 flex flex-col h-full border-2">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg line-clamp-2 text-center flex-1">{selectedAd.title}</h3>
                      <Badge variant="secondary" className="ml-2">{selectedAd.category}</Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-greenyp-600" />
                        {selectedAd.zipCode}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-greenyp-600" />
                        {format(new Date(selectedAd.createdAt), 'MMM dd')}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-grow flex flex-col">
                    {selectedAd.images.length > 0 && (
                      <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={selectedAd.images[0]} 
                          alt={selectedAd.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <p className="text-gray-700 text-sm line-clamp-3 flex-grow text-left">
                      {selectedAd.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-greenyp-600" />
                        <span className="text-gray-600">
                          {formatContact(selectedAd.email, 'email')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-greenyp-600" />
                        <span className="text-gray-600">
                          {formatContact(selectedAd.phone, 'phone')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View More
                      </Button>
                      <Button 
                        className="w-full bg-greenyp-600 hover:bg-greenyp-700"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Seller
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Detailed View Preview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Detailed View (full ad page)</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 text-center flex-1">{selectedAd.title}</h1>
                  <Badge variant="secondary" className="ml-4">{selectedAd.category}</Badge>
                </div>

                <div className="flex items-center text-gray-500 space-x-6 mb-6">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-greenyp-600" />
                    <span>{location.city}, {location.state} {selectedAd.zipCode}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-greenyp-600" />
                    <span>Posted {format(new Date(selectedAd.createdAt), 'MMMM dd, yyyy')}</span>
                  </div>
                </div>

                {selectedAd.images.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Photos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedAd.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${selectedAd.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                            onError={(e) => {
                              console.log(`Image failed to load: ${image}`);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Description</h3>
                  <div className="text-gray-700 text-left whitespace-pre-wrap leading-relaxed">
                    {selectedAd.description}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-greenyp-600" />
                      <span className="text-gray-700">
                        {location.city}, {location.state} {selectedAd.zipCode}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-greenyp-600" />
                      <span className="text-gray-700">
                        {formatContact(selectedAd.email, 'email')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-greenyp-600" />
                      <span className="text-gray-700">
                        {formatContact(selectedAd.phone, 'phone')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Button className="bg-greenyp-600 hover:bg-greenyp-700 flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50 flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{selectedPricing.name} Tier Features</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Price: ${selectedPricing.price}/month</li>
              <li>• Maximum Images: {selectedPricing.maxImages}</li>
              <li>• Contact Privacy: {selectedPricing.contactObfuscation ? 'Yes' : 'No'}</li>
              <li>• {selectedPricing.description}</li>
            </ul>
          </div>
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default PrototypeAds;
