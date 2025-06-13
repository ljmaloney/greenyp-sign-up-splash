
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Globe, Edit, Trash2 } from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/config/api';
import AddLocationDialog from './AddLocationDialog';
import EditLocationDialog from './EditLocationDialog';

const LocationsList = () => {
  const [searchParams] = useSearchParams();
  const producerId = searchParams.get('producerId');
  
  const { data: locations, isLoading, error, refetch } = useLocations(producerId);
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log('📍 LocationsList - producerId:', producerId);
  console.log('📍 LocationsList - locations data:', locations);
  console.log('📍 LocationsList - loading:', isLoading);
  console.log('📍 LocationsList - error:', error);

  const handleAddLocation = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditLocation = (location) => {
    setSelectedLocation(location);
    setIsEditDialogOpen(true);
  };

  const handleDeleteLocation = async (location) => {
    if (window.confirm('Are you sure you want to delete this location? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        const response = await fetch(getApiUrl(`/producer/location/${location.locationId}`), {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Failed to delete location: ${response.status}`);
        }

        toast({
          title: "Location Deleted",
          description: "Location has been successfully deleted.",
        });
        
        refetch();
      } catch (error) {
        console.error('Error deleting location:', error);
        toast({
          title: "Error",
          description: "Failed to delete location. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleLocationAdded = () => {
    refetch();
  };

  const handleLocationUpdated = () => {
    refetch();
  };

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
        <Button onClick={handleAddLocation} className="bg-greenyp-600 hover:bg-greenyp-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditLocation(location)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteLocation(location)}
                      disabled={isDeleting}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

      <AddLocationDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onLocationAdded={handleLocationAdded}
      />

      {selectedLocation && (
        <EditLocationDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedLocation(null);
          }}
          location={selectedLocation}
          onLocationUpdated={handleLocationUpdated}
        />
      )}
    </div>
  );
};

export default LocationsList;
