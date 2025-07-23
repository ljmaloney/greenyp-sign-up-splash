
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Location } from '@/services/locationService.ts';
import { Contact } from '@/services/contactService.ts';
import LocationCardHeader from './LocationCardHeader.tsx';
import LocationCardBasicInfo from './LocationCardBasicInfo.tsx';
import LocationCardDetails from './LocationCardDetails.tsx';
import LocationCardHours from './LocationCardHours.tsx';
import LocationContactsList from './LocationContactsList.tsx';

interface LocationCardProps {
  location: Location;
  onEdit: (location: Location) => void;
  onEditContact?: (contact: Contact) => void;
  onDeleteContact?: (contact: Contact) => void;
}

const LocationCard = ({ location, onEdit, onEditContact, onDeleteContact }: LocationCardProps) => {
  const [searchParams] = useSearchParams();
  const producerId = searchParams.get('producerId');

  return (
    <Card>
      <LocationCardHeader location={location} onEdit={onEdit} />
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <LocationCardBasicInfo location={location} />
          <LocationCardDetails location={location} />
        </div>

        <LocationCardHours location={location} />

        {/* Contacts Section */}
        {producerId && (
          <LocationContactsList 
            producerId={producerId}
            locationId={location.locationId}
            onEditContact={onEditContact}
            onDeleteContact={onDeleteContact}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LocationCard;
