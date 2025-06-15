
import React from 'react';
import { Location } from '@/services/locationService';

interface LocationCardDetailsProps {
  location: Location;
}

const LocationCardDetails = ({ location }: LocationCardDetailsProps) => {
  return (
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
  );
};

export default LocationCardDetails;
