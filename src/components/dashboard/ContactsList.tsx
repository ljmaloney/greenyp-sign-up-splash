
import React, { useState } from 'react';
import { Contact } from "@/types/contact";
import { useContactsList } from "@/hooks/useContactsList";
import AddContactDialog from './AddContactDialog';
import EditContactDialog from './EditContactDialog';
import LocationGroup from './LocationGroup';
import DeleteContactDialog from './DeleteContactDialog';

const ContactsList = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);
  const [preSelectedLocationId, setPreSelectedLocationId] = useState<string>('');

  const {
    locations,
    groupedContacts,
    openLocations,
    isDeleting,
    toggleLocation,
    handleContactAdded,
    handleContactUpdated,
    handleDeleteContact
  } = useContactsList();

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleDeleteContactClick = (contactId: string) => {
    setDeletingContactId(contactId);
  };

  const handleDeleteConfirm = () => {
    if (deletingContactId) {
      handleDeleteContact(deletingContactId);
      setDeletingContactId(null);
    }
  };

  const handleContactUpdatedWrapper = (updatedContactData: any) => {
    if (editingContact) {
      handleContactUpdated(updatedContactData, editingContact);
      setEditingContact(null);
    }
  };

  const handleAddContactClick = (locationId: string) => {
    const actualLocationId = locationId === 'no-location' ? '' : locationId;
    setPreSelectedLocationId(actualLocationId);
    setIsAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setPreSelectedLocationId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedContacts).map(([locationId, locationContacts]) => (
          <LocationGroup
            key={locationId}
            locationId={locationId}
            locationContacts={locationContacts}
            locations={locations}
            isOpen={openLocations[locationId] ?? true}
            onToggle={() => toggleLocation(locationId)}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContactClick}
            onAddContact={handleAddContactClick}
          />
        ))}
      </div>

      <AddContactDialog 
        isOpen={isAddDialogOpen}
        onClose={handleAddDialogClose}
        locations={locations}
        onContactAdded={handleContactAdded}
        preSelectedLocationId={preSelectedLocationId}
      />

      {editingContact && (
        <EditContactDialog 
          isOpen={!!editingContact}
          onClose={() => setEditingContact(null)}
          contact={editingContact}
          locations={locations}
          onContactUpdated={handleContactUpdatedWrapper}
        />
      )}

      <DeleteContactDialog
        isOpen={!!deletingContactId}
        onClose={() => setDeletingContactId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ContactsList;
