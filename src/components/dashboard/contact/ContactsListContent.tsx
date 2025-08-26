
import React from 'react';
import ContactCard from './ContactCard.tsx';
import ContactsLoadingState from './ContactsLoadingState.tsx';
import ContactsErrorState from './ContactsErrorState.tsx';
import ContactsNoProducerState from './ContactsNoProducerState.tsx';
import ContactsEmptyState from './ContactsEmptyState.tsx';
import type { Contact as ServiceContact } from '@/services/contactService.ts';
import type { Location } from '@/services/locationService.ts';

interface ContactsListContentProps {
  producerId: string | null;
  contacts: ServiceContact[] | undefined;
  locations: Location[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onEditContact: (contact: ServiceContact) => void;
  onDeleteContact: (contact: ServiceContact) => void;
}

const ContactsListContent = ({
  producerId,
  contacts,
  locations,
  isLoading,
  error,
  onEditContact,
  onDeleteContact
}: ContactsListContentProps) => {
  const getLocationName = (locationId: string) => {
    if (!locations) return locationId;
    const location = locations.find(loc => loc.locationId === locationId);
    return location ? location.locationName : locationId;
  };

  if (isLoading) {
    return <ContactsLoadingState />;
  }

  if (error) {
    return <ContactsErrorState error={error} />;
  }

  if (!producerId) {
    return <ContactsNoProducerState />;
  }

  if (!contacts || contacts.length === 0) {
    return <ContactsEmptyState />;
  }

  return (
    <div className="grid gap-6">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.contactId}
          contact={contact}
          contacts={contacts}
          onEdit={onEditContact}
          onDelete={onDeleteContact}
          getLocationName={getLocationName}
        />
      ))}
    </div>
  );
};

export default ContactsListContent;
