
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocationCache } from '@/hooks/useLocationCache';
import { Location } from '@/services/locationService';
import AddLocationDialog from './AddLocationDialog';
import EditLocationDialog from './EditLocationDialog';
import LocationsHeader from './LocationsHeader';
import LocationsLoadingState from './LocationsLoadingState';
import LocationsErrorState from './LocationsErrorState';
import LocationsEmptyState from './LocationsEmptyState';
import LocationCard from './LocationCard';

const LocationsList = () => {
  const [searchParams] = useSearchParams();
  const producerId = searchParams.get('producerId');
  
  const { 
    locations, 
    isLoading, 
    error, 
    invalidateLocationCache,
    updateLocationCache 
  } = useLocationCache();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  console.log('🏢 Cached locations data:', locations);

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

  if (isLoading) {
    return <LocationsLoadingState />;
  }

  if (error) {
    return <LocationsErrorState error={error} onRetry={() => invalidateLocationCache()} />;
  }

  return (
    <div className="space-y-6">
      <LocationsHeader onAddLocation={handleAddLocation} />

      {!locations || locations.length === 0 ? (
        <LocationsEmptyState onAddLocation={handleAddLocation} />
      ) : (
        <div className="grid gap-6">
          {locations.map((location) => (
            <LocationCard 
              key={location.locationId}
              location={location} 
              onEdit={handleEditLocation}
            />
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
