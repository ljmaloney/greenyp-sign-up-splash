
import React from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Plus } from 'lucide-react';

interface LocationsHeaderProps {
  onAddLocation: () => void;
}

const LocationsHeader = ({ onAddLocation }: LocationsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-greenyp-600">Locations</h1>
      <Button 
        onClick={onAddLocation}
        className="bg-greenyp-600 hover:bg-greenyp-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Location
      </Button>
    </div>
  );
};

export default LocationsHeader;
