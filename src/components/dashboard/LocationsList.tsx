import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Globe } from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import { useAccountData } from '@/hooks/useAccountData';
import { useAuth } from '@/contexts/AuthContext';
import AddLocationDialog from './AddLocationDialog';
import EditLocationDialog from './EditLocationDialog';
import LocationHoursDisplay from './LocationHoursDisplay';

const LocationsList = () => {
  const [searchParams] = useSearchParams();
  const producerId = searchParams.get('producerId');
  const { user } = useAuth();
  const externalUserRef = user?.id || null;
  
  const { data: accountData } = useAccountData(externalUserRef);
  const { data: locations, isLoading, error, refetch } = useLocations(producerId);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  console.log('🏢 Locations data:', locations);

  const handleLocationAdded = () => {
    refetch();
  };

  const handleLocationUpdated = () => {
    refetch();
    setEditingLocation(null);
  };

  const formatAddress = (location) => {
    const parts = [
      location.addressLine1,
      location.addressLine2,
      location.addressLine3,
      `${location.city}, ${location.state} ${location.postalCode}`
    ].filter(Boolean);
    return parts.join(', ');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-greenyp-600">Locations</h1>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-greenyp-600">Locations</h1>
        </div>
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading locations: {error.message}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-greenyp-600">Locations</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-greenyp-600 hover:bg-greenyp-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      {!locations || locations.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first location.</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-greenyp-600 hover:bg-greenyp-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {locations.map((location) => (
            <div key={location.locationId} className="space-y-4">
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
                      onClick={() => setEditingLocation(location)}
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

              <LocationHoursDisplay 
                locationId={location.locationId}
                locationHours={location.locationHours}
                locationName={location.locationName}
              />
            </div>
          ))}
        </div>
      )}

      <AddLocationDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onLocationAdded={handleLocationAdded}
      />

      {editingLocation && (
        <EditLocationDialog
          isOpen={true}
          onClose={() => setEditingLocation(null)}
          location={editingLocation}
          onLocationUpdated={handleLocationUpdated}
        />
      )}
    </div>
  );
};

export default LocationsList;
