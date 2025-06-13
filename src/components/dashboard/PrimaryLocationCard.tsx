
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye, Building2 } from 'lucide-react';
import { PrimaryLocation } from '@/services/accountService';

interface PrimaryLocationCardProps {
  primaryLocation: PrimaryLocation;
}

const PrimaryLocationCard = ({ primaryLocation }: PrimaryLocationCardProps) => {
  const getLocationDisplayTypeLabel = (type: string) => {
    switch (type) {
      case 'NO_DISPLAY':
        return 'Location not displayed in search results';
      case 'CITY_STATE_ZIP':
        return 'Display only the city, state, and zip code in search results';
      case 'FULL_ADDRESS':
        return 'Display full address in search results';
      default:
        return type.replace('_', ' ');
    }
  };

  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case 'HOME_OFFICE_PRIMARY':
        return 'Home/Office - Primary';
      case 'RETAIL_SALES_SERVICE':
        return 'Retail Sales or Service';
      case 'WHOLESALE_SALES':
        return 'Wholesale Sales';
      default:
        return type.replace('_', ' ');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-greenyp-600">
          <MapPin className="h-5 w-5" />
          Primary Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{primaryLocation.locationName}</h3>
            <div className="text-gray-600 mt-2">
              <p>{primaryLocation.addressLine1}</p>
              {primaryLocation.addressLine2 && <p>{primaryLocation.addressLine2}</p>}
              <p>{primaryLocation.city}, {primaryLocation.state} {primaryLocation.postalCode}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <span className="text-sm text-gray-600">Location Type:</span>
                <p className="text-sm font-medium">
                  {getLocationTypeLabel(primaryLocation.locationType)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Eye className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <span className="text-sm text-gray-600">Display Type:</span>
                <p className="text-sm font-medium">
                  {getLocationDisplayTypeLabel(primaryLocation.locationDisplayType)}
                </p>
              </div>
            </div>
          </div>

          <Badge variant="outline">
            {getLocationTypeLabel(primaryLocation.locationType)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrimaryLocationCard;
