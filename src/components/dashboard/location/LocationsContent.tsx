
import React from 'react';
import { Location } from '@/services/locationService.ts';
import LocationsEmptyState from './LocationsEmptyState.tsx';
import LocationCard from './LocationCard.tsx';

interface LocationsContentProps {
  locations: Location[] | undefined;
  onAddLocation: () => void;
  onEditLocation: (location: Location) => void;
}

const LocationsContent = ({ locations, onAddLocation, onEditLocation }: LocationsContentProps) => {
  if (!locations || locations.length === 0) {
    return <LocationsEmptyState onAddLocation={onAddLocation} />;
  }

  return (
    <div className="grid gap-6">
      {locations.map((location) => (
        <LocationCard 
          key={location.locationId}
          location={location} 
          onEdit={onEditLocation}
        />
      ))}
    </div>
  );
};

export default LocationsContent;
