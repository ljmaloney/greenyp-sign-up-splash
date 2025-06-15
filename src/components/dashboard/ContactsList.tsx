
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContacts } from '@/hooks/useContacts';
import { useLocations } from '@/hooks/useLocations';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/config/api';
import AddContactDialog from './AddContactDialog';
import EditContactDialog from './EditContactDialog';
import DeleteContactDialog from './DeleteContactDialog';
import ContactsHeader from './ContactsHeader';
import ContactsLoadingState from './ContactsLoadingState';
import ContactsErrorState from './ContactsErrorState';
import ContactsNoProducerState from './ContactsNoProducerState';
import ContactsEmptyState from './ContactsEmptyState';
import ContactCard from './ContactCard';
import type { Contact as ServiceContact } from '@/services/contactService';
import type { Contact as ComponentContact } from '@/types/contact';

const ContactsList = () => {
  const [searchParams] = useSearchParams();
  const producerId = searchParams.get('producerId');
  
  const { data: contacts, isLoading, error, refetch } = useContacts(producerId);
  const { data: locations } = useLocations(producerId);
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ServiceContact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log('👥 ContactsList - producerId:', producerId);
  console.log('👥 ContactsList - contacts data:', contacts);
  console.log('👥 ContactsList - loading:', isLoading);
  console.log('👥 ContactsList - error:', error);

  const handleAddContact = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditContact = (contact: ServiceContact) => {
    setSelectedContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleDeleteContact = (contact: ServiceContact) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (!selectedContact) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(getApiUrl(`/producer/contact/${selectedContact.contactId}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete contact: ${response.status}`);
      }

      toast({
        title: "Contact Deleted",
        description: "Contact has been successfully deleted.",
      });
      
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedContact(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleContactAdded = () => {
    refetch();
  };

  const handleContactUpdated = () => {
    refetch();
  };

  // Transform service contact to component contact format
  const transformContactForDialog = (contact: ServiceContact): ComponentContact => {
    return {
      id: contact.contactId,
      producerLocationId: contact.producerLocationId,
      producerContactType: contact.producerContactType,
      displayContactType: contact.displayContactType,
      genericContactName: contact.genericContactName,
      firstName: contact.firstName,
      lastName: contact.lastName,
      title: contact.title,
      phoneNumber: contact.phoneNumber,
      cellPhoneNumber: contact.cellPhoneNumber,
      emailAddress: contact.emailAddress,
      name: `${contact.firstName} ${contact.lastName}`,
      email: contact.emailAddress,
      phone: contact.phoneNumber,
      isPrimary: contact.producerContactType === 'PRIMARY'
    };
  };

  // Transform service contacts to component contacts format for validation
  const transformContactsForValidation = (serviceContacts: ServiceContact[]): ComponentContact[] => {
    return serviceContacts.map(transformContactForDialog);
  };

  const getLocationName = (locationId: string) => {
    if (!locations) return locationId;
    const location = locations.find(loc => loc.locationId === locationId);
    return location ? location.locationName : locationId;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ContactsHeader onAddContact={handleAddContact} />
        <ContactsLoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ContactsHeader onAddContact={handleAddContact} />
        <ContactsErrorState error={error} />
      </div>
    );
  }

  if (!producerId) {
    return (
      <div className="space-y-6">
        <ContactsHeader onAddContact={handleAddContact} />
        <ContactsNoProducerState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ContactsHeader onAddContact={handleAddContact} />

      {!contacts || contacts.length === 0 ? (
        <ContactsEmptyState />
      ) : (
        <div className="grid gap-6">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.contactId}
              contact={contact}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
              getLocationName={getLocationName}
            />
          ))}
        </div>
      )}

      {locations && (
        <AddContactDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          locations={locations.map(loc => ({
            id: loc.locationId,
            locationName: loc.locationName
          }))}
          onContactAdded={handleContactAdded}
          existingContacts={contacts ? transformContactsForValidation(contacts) : []}
        />
      )}

      {selectedContact && locations && (
        <EditContactDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedContact(null);
          }}
          contact={transformContactForDialog(selectedContact)}
          locations={locations.map(loc => ({
            id: loc.locationId,
            locationName: loc.locationName
          }))}
          onContactUpdated={handleContactUpdated}
          existingContacts={contacts ? transformContactsForValidation(contacts) : []}
        />
      )}

      <DeleteContactDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedContact(null);
        }}
        onConfirm={confirmDeleteContact}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ContactsList;
