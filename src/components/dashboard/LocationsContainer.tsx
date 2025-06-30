
import React from 'react';
import { useLocationCache } from '@/hooks/useLocationCache';
import LocationsLoadingState from './LocationsLoadingState';
import LocationsErrorState from './LocationsErrorState';
import LocationsHeader from './LocationsHeader';
import LocationsContent from './LocationsContent';

interface LocationsContainerProps {
  onAddLocation: () => void;
  onEditLocation: (location: any) => void;
}

const LocationsContainer = ({ onAddLocation, onEditLocation }: LocationsContainerProps) => {
  const { 
    locations, 
    isLoading, 
    error, 
    invalidateLocationCache
  } = useLocationCache();

  console.log('🏢 Cached locations data:', locations);

  if (isLoading) {
    return <LocationsLoadingState />;
  }

  if (error) {
    return <LocationsErrorState error={error} onRetry={() => invalidateLocationCache()} />;
  }

  return (
    <div className="space-y-6">
      <LocationsHeader onAddLocation={onAddLocation} />
      <LocationsContent 
        locations={locations}
        onAddLocation={onAddLocation}
        onEditLocation={onEditLocation}
      />
    </div>
  );
};

export default LocationsContainer;
