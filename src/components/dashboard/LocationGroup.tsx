
import React from 'react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Contact, Location } from "@/types/contact";
import ContactCard from './ContactCard';

interface LocationGroupProps {
  locationId: string;
  locationContacts: Contact[];
  locations: Location[];
  isOpen: boolean;
  onToggle: () => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
  onAddContact: (locationId: string) => void;
}

const LocationGroup = ({ 
  locationId, 
  locationContacts, 
  locations, 
  isOpen, 
  onToggle, 
  onEditContact, 
  onDeleteContact,
  onAddContact
}: LocationGroupProps) => {
  const getLocationName = (locationId?: string) => {
    if (!locationId) return 'No Location';
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.locationName : 'Unknown Location';
  };

  const locationName = getLocationName(locationId === 'no-location' ? undefined : locationId);
  const hasMultipleContacts = locationContacts.length > 1;

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <Collapsible open={isOpen} onOpenChange={() => hasMultipleContacts && onToggle()}>
        <div className="bg-greenyp-50 p-4 border-b border-greenyp-100">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <div className={`flex items-center flex-1 ${hasMultipleContacts ? 'cursor-pointer' : 'cursor-default'}`}>
                <MapPin className="w-4 h-4 mr-2 text-greenyp-600" />
                <h3 className="font-semibold text-gray-900">{locationName}</h3>
                <span className="ml-2 text-sm text-gray-500">({locationContacts.length} contact{locationContacts.length !== 1 ? 's' : ''})</span>
                {hasMultipleContacts && (
                  <div className="ml-2">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                  </div>
                )}
              </div>
            </CollapsibleTrigger>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAddContact(locationId)}
              className="ml-4 bg-greenyp-700 hover:bg-greenyp-800 text-white border-greenyp-700 hover:border-greenyp-800"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <CollapsibleContent>
          <div className="divide-y bg-white">
            {locationContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={onEditContact}
                onDelete={onDeleteContact}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default LocationGroup;
