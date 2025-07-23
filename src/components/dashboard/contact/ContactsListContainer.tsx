
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContacts } from '@/hooks/useContacts.ts';
import { useLocations } from '@/hooks/useLocations.ts';
import ContactsHeader from './ContactsHeader.tsx';
import ContactsListContent from './ContactsListContent.tsx';
import ContactsDialogManager from './ContactsDialogManager.tsx';
import type { Contact as ServiceContact } from '@/services/contactService.ts';

const ContactsListContainer = () => {
  const [searchParams] = useSearchParams();
  const producerId = searchParams.get('producerId');
  
  const { data: contacts, isLoading, error, refetch } = useContacts(producerId);
  const { data: locations } = useLocations(producerId);

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

  const handleContactAdded = () => {
    refetch();
  };

  const handleContactUpdated = () => {
    refetch();
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedContact(null);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedContact(null);
  };

  return (
    <div className="space-y-6">
      <ContactsHeader onAddContact={handleAddContact} />

      <ContactsListContent
        producerId={producerId}
        contacts={contacts}
        locations={locations}
        isLoading={isLoading}
        error={error}
        onEditContact={handleEditContact}
        onDeleteContact={handleDeleteContact}
      />

      <ContactsDialogManager
        isAddDialogOpen={isAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        selectedContact={selectedContact}
        isDeleting={isDeleting}
        contacts={contacts}
        locations={locations}
        onAddDialogClose={handleAddDialogClose}
        onEditDialogClose={handleEditDialogClose}
        onDeleteDialogClose={handleDeleteDialogClose}
        onContactAdded={handleContactAdded}
        onContactUpdated={handleContactUpdated}
        refetch={refetch}
        isDashboardEdit={false}
      />
    </div>
  );
};

export default ContactsListContainer;
