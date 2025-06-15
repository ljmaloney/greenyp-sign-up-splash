
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Edit, Globe } from 'lucide-react';
import { Location } from '@/services/locationService';

interface LocationCardProps {
  location: Location;
  onEdit: (location: Location) => void;
}

const LocationCard = ({ location, onEdit }: LocationCardProps) => {
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl text-greenyp-600">{location.locationName}</CardTitle>
              <Badge variant={location.active ? 'default' : 'secondary'}>
                {location.active ? 'Active' : 'Inactive'}
              </Badge>
              {location.locationType === 'HOME_OFFICE_PRIMARY' && (
                <Badge variant="outline">Primary</Badge>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(location)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Address:</span>
              <span className="text-gray-900">{formatAddress(location)}</span>
            </div>
            
            {location.websiteUrl && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Website:</span>
                <a 
                  href={location.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-greenyp-600 hover:text-greenyp-700 underline"
                >
                  {location.websiteUrl}
                </a>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-gray-600">Type: </span>
              <span className="text-gray-900">
                {location.locationType === 'HOME_OFFICE_PRIMARY' ? 'Primary Office' :
                 location.locationType === 'RETAIL_SALES_SERVICE' ? 'Retail Sales & Service' :
                 location.locationType === 'WHOLESALE_SALES' ? 'Wholesale' :
                 location.locationType}
              </span>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-600">Display: </span>
              <span className="text-gray-900">
                {location.locationDisplayType === 'NO_DISPLAY' ? 'Hidden from search' :
                 location.locationDisplayType === 'CITY_STATE_ZIP' ? 'City, State, ZIP only' :
                 location.locationDisplayType === 'FULL_ADDRESS' ? 'Full address' :
                 location.locationDisplayType}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
