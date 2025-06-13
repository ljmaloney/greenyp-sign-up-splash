
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { PrimaryLocation } from '@/services/accountService';

interface PrimaryLocationCardProps {
  primaryLocation: PrimaryLocation;
}

const PrimaryLocationCard = ({ primaryLocation }: PrimaryLocationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Primary Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="font-semibold">{primaryLocation.locationName}</h3>
          <div className="text-gray-600">
            <p>{primaryLocation.addressLine1}</p>
            {primaryLocation.addressLine2 && <p>{primaryLocation.addressLine2}</p>}
            <p>{primaryLocation.city}, {primaryLocation.state} {primaryLocation.postalCode}</p>
          </div>
          <Badge variant="outline">
            {primaryLocation.locationType.replace('_', ' ')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrimaryLocationCard;
