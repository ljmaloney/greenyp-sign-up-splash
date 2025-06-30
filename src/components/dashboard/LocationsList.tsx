
import React, { useState } from 'react';
import { Location } from '@/services/locationService';
import { useLocationCache } from '@/hooks/useLocationCache';
import LocationsContainer from './LocationsContainer';
import LocationsDialogManager from './LocationsDialogManager';

const LocationsList = () => {
  const { updateLocationCache } = useLocationCache();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const handleLocationAdded = (newLocation: Location) => {
    updateLocationCache(newLocation);
  };

  const handleLocationUpdated = (updatedLocation: Location) => {
    updateLocationCache(updatedLocation);
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
