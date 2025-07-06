
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { Classified } from '@/types/classifieds';

interface PrototypeAdDetailProps {
  classified: Classified;
}

const PrototypeAdDetail = ({ classified }: PrototypeAdDetailProps) => {
  // Add safety check for undefined classified
  if (!classified) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 text-center text-gray-500">
          Loading ad details...
        </div>
      </div>
    );
  }

  const formatContact = (contact: string, type: 'email' | 'phone') => {
    if (!classified.contactObfuscated) {
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

  const location = getLocationInfo(classified.zipCode);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900 text-center flex-1">{classified.title}</h1>
          <Badge variant="secondary" className="ml-4">{classified.category}</Badge>
        </div>

        <div className="flex items-center text-gray-500 space-x-6 mb-6">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-greenyp-600" />
            <span>{location.city}, {location.state} {classified.zipCode}</span>
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
            {classified.description}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-3 text-greenyp-600" />
              <span className="text-gray-700">
                {location.city}, {location.state} {classified.zipCode}
              </span>
            </div>
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
  );
};

export default PrototypeAdDetail;
