
import React from 'react';
import { MapPin, Globe } from 'lucide-react';
import { Location } from '@/services/locationService';

interface LocationCardBasicInfoProps {
  location: Location;
}

const LocationCardBasicInfo = ({ location }: LocationCardBasicInfoProps) => {
  const formatAddress = (location: Location) => {
    const parts = [
      location.addressLine1,
      location.addressLine2,
      location.addressLine3,
      `${location.city}, ${location.state} ${location.postalCode}`
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-gray-500" />
        <span className="text-gray-600">Address:</span>
        <span className="text-gray-900">{formatAddress(location)}</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <Globe className="h-4 w-4 text-gray-500" />
        <span className="text-gray-600">Website:</span>
        {location.websiteUrl ? (
          <a 
            href={location.websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-greenyp-600 hover:text-greenyp-700 underline"
          >
            {location.websiteUrl}
          </a>
        ) : (
          <span className="text-gray-400 italic">No website provided</span>
        )}
      </div>
    </div>
  );
};

export default LocationCardBasicInfo;
