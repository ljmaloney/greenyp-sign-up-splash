
import React from 'react';
import { useLocationCache } from '@/hooks/useLocationCache.ts';
import LocationsLoadingState from './LocationsLoadingState.tsx';
import LocationsErrorState from './LocationsErrorState.tsx';
import LocationsHeader from './LocationsHeader.tsx';
import LocationsContent from './LocationsContent.tsx';

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
