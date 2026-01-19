
import React, { useState } from 'react';
import { Location } from '@/services/locationService.ts';
import { LocationFormData } from '@/types/location.ts';
import { useLocationCache } from '@/hooks/useLocationCache.ts';
import LocationsContainer from './LocationsContainer.tsx';
import LocationsDialogManager from './LocationsDialogManager.tsx';

const LocationsList = () => {
  const { updateLocationCache } = useLocationCache();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const handleLocationAdded = (newLocation: Location) => {
    updateLocationCache(newLocation);
  };

  const handleLocationUpdated = (updatedLocation: LocationFormData) => {
    // Convert LocationFormData to Location for cache update
    if (updatedLocation.locationId) {
      updateLocationCache({
        locationId: updatedLocation.locationId,
        producerId: editingLocation?.producerId || '',
        createDate: editingLocation?.createDate || '',
        lastUpdateDate: new Date().toISOString(),
        locationName: updatedLocation.locationName,
        locationType: updatedLocation.locationType,
        locationDisplayType: updatedLocation.locationDisplayType,
        active: updatedLocation.active,
        addressLine1: updatedLocation.addressLine1,
        addressLine2: updatedLocation.addressLine2,
        addressLine3: updatedLocation.addressLine3,
        city: updatedLocation.city,
        state: updatedLocation.state,
        postalCode: updatedLocation.postalCode,
        latitude: updatedLocation.latitude,
        longitude: updatedLocation.longitude,
        websiteUrl: updatedLocation.websiteUrl,
        locationHours: editingLocation?.locationHours || []
      });
    }
    setEditingLocation(null);
  };

  const handleAddLocation = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
  };

  return (
    <>
      <LocationsContainer 
        onAddLocation={handleAddLocation}
        onEditLocation={handleEditLocation}
      />

      <LocationsDialogManager
        isAddDialogOpen={isAddDialogOpen}
        editingLocation={editingLocation}
        onCloseAddDialog={() => setIsAddDialogOpen(false)}
        onCloseEditDialog={() => setEditingLocation(null)}
        onLocationAdded={handleLocationAdded}
        onLocationUpdated={handleLocationUpdated}
      />
    </>
  );
};

export default LocationsList;
