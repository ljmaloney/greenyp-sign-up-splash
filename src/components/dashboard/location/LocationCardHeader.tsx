
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Edit } from 'lucide-react';
import { Location } from '@/services/locationService.ts';

interface LocationCardHeaderProps {
  location: Location;
  onEdit: (location: Location) => void;
}

const LocationCardHeader = ({ location, onEdit }: LocationCardHeaderProps) => {
  return (
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
          onClick={() => onEdit(location)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

export default LocationCardHeader;
