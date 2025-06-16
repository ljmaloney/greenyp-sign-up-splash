
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/config/api';
import AddContactDialog from './AddContactDialog';
import EditContactDialog from './EditContactDialog';
import DeleteContactDialog from './DeleteContactDialog';
import type { Contact as ServiceContact } from '@/services/contactService';
import type { Contact as ComponentContact } from '@/types/contact';
import type { Location } from '@/services/locationService';

interface ContactsDialogManagerProps {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedContact: ServiceContact | null;
  isDeleting: boolean;
  contacts: ServiceContact[] | undefined;
  locations: Location[] | undefined;
  onAddDialogClose: () => void;
  onEditDialogClose: () => void;
  onDeleteDialogClose: () => void;
  onContactAdded: () => void;
  onContactUpdated: () => void;
  refetch: () => void;
  isDashboardEdit?: boolean;
}

const ContactsDialogManager = ({
  isAddDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  selectedContact,
  isDeleting,
  contacts,
  locations,
  onAddDialogClose,
  onEditDialogClose,
  onDeleteDialogClose,
  onContactAdded,
  onContactUpdated,
  refetch,
  isDashboardEdit = false
}: ContactsDialogManagerProps) => {
  const { toast } = useToast();

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

  const confirmDeleteContact = async () => {
    if (!selectedContact) return;
    
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
      onDeleteDialogClose();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {locations && (
        <AddContactDialog
          isOpen={isAddDialogOpen}
          onClose={onAddDialogClose}
          locations={locations.map(loc => ({
            id: loc.locationId,
            locationName: loc.locationName
          }))}
          onContactAdded={onContactAdded}
          existingContacts={contacts ? transformContactsForValidation(contacts) : []}
          isDashboardEdit={isDashboardEdit}
        />
      )}

      {selectedContact && locations && (
        <EditContactDialog
          isOpen={isEditDialogOpen}
          onClose={onEditDialogClose}
          contact={transformContactForDialog(selectedContact)}
          locations={locations.map(loc => ({
            id: loc.locationId,
            locationName: loc.locationName
          }))}
          onContactUpdated={onContactUpdated}
          existingContacts={contacts ? transformContactsForValidation(contacts) : []}
          isDashboardEdit={isDashboardEdit}
        />
      )}

      <DeleteContactDialog
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onConfirm={confirmDeleteContact}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ContactsDialogManager;
