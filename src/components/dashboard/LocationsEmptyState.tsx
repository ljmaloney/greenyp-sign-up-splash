
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';

interface LocationsEmptyStateProps {
  onAddLocation: () => void;
}

const LocationsEmptyState = ({ onAddLocation }: LocationsEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
        <p className="text-gray-600 mb-4">Get started by adding your first location.</p>
        <Button 
          onClick={onAddLocation}
          className="bg-greenyp-600 hover:bg-greenyp-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationsEmptyState;
