
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
  const [activeOnly, setActiveOnly] = useState(false);
  
  const { data: contacts, isLoading, error, refetch } = useContacts(producerId, activeOnly);
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
      
      {/* Contact Filter Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-gray-700">Show contacts:</span>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="contactFilter"
                value="all"
                checked={!activeOnly}
                onChange={() => setActiveOnly(false)}
                className="mr-2 text-greenyp-600 focus:ring-greenyp-500"
              />
              <span className="text-sm text-gray-700">All contacts (including disabled)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="contactFilter"
                value="active"
                checked={activeOnly}
                onChange={() => setActiveOnly(true)}
                className="mr-2 text-greenyp-600 focus:ring-greenyp-500"
              />
              <span className="text-sm text-gray-700">Active contacts only</span>
            </label>
          </div>
        </div>
      </div>

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
