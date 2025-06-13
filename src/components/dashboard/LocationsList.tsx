
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Globe } from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';

const LocationsList = () => {
  const [searchParams] = useSearchParams();
  const producerId = searchParams.get('producerId');
  
  const { data: locations, isLoading, error } = useLocations(producerId);

  console.log('📍 LocationsList - producerId:', producerId);
  console.log('📍 LocationsList - locations data:', locations);
  console.log('📍 LocationsList - loading:', isLoading);
  console.log('📍 LocationsList - error:', error);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Locations</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Locations</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">Error loading locations</p>
              <p className="text-sm text-gray-600">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!producerId) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Locations</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-600">Producer ID is required to load locations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getLocationTypeDisplay = (locationType: string) => {
    switch (locationType) {
      case 'HOME_OFFICE_PRIMARY':
        return 'Home Office (Primary)';
      case 'HOME_OFFICE':
        return 'Home Office';
      case 'COMMERCIAL':
        return 'Commercial';
      case 'WAREHOUSE':
        return 'Warehouse';
      default:
        return locationType;
    }
  };

  const getDisplayTypeDisplay = (displayType: string) => {
    switch (displayType) {
      case 'CITY_STATE_ZIP':
        return 'City, State, ZIP';
      case 'FULL_ADDRESS':
        return 'Full Address';
      case 'NO_DISPLAY':
        return 'Do Not Display';
      default:
        return displayType;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Locations</h1>
      </div>

      {!locations || locations.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No locations found</h3>
              <p className="text-gray-600">Get started by adding your first location.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {locations.map((location) => (
            <Card key={location.locationId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-greenyp-600 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {location.locationName}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={location.active ? 'default' : 'secondary'}>
                        {location.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {getLocationTypeDisplay(location.locationType)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Address</h4>
                      <div className="text-sm space-y-1">
                        <p>{location.addressLine1}</p>
                        {location.addressLine2 && <p>{location.addressLine2}</p>}
                        {location.addressLine3 && <p>{location.addressLine3}</p>}
                        <p>{location.city}, {location.state} {location.postalCode}</p>
                      </div>
                    </div>
                    
                    {location.websiteUrl && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Website:</span>
                        <a 
                          href={location.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-greenyp-600 hover:text-greenyp-700"
                        >
                          {location.websiteUrl}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Details</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="text-gray-600">Display Type:</span> {getDisplayTypeDisplay(location.locationDisplayType)}</p>
                        <p><span className="text-gray-600">Coordinates:</span> {location.latitude}, {location.longitude}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationsList;
