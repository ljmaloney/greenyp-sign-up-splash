
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Phone, Mail, Plus, Edit, Trash2 } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { useLocations } from '@/hooks/useLocations';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/config/api';
import AddContactDialog from './AddContactDialog';
import EditContactDialog from './EditContactDialog';
import DeleteContactDialog from './DeleteContactDialog';

const ContactsList = () => {
  const [searchParams] = useSearchParams();
  const producerId = searchParams.get('producerId');
  
  const { data: contacts, isLoading, error, refetch } = useContacts(producerId);
  const { data: locations } = useLocations(producerId);
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log('👥 ContactsList - producerId:', producerId);
  console.log('👥 ContactsList - contacts data:', contacts);
  console.log('👥 ContactsList - loading:', isLoading);
  console.log('👥 ContactsList - error:', error);

  const handleAddContact = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleDeleteContact = (contact) => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Contacts</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Contacts</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">Error loading contacts</p>
              <p className="text-sm text-gray-600">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!producerId) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Contacts</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-600">Producer ID is required to load contacts</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getContactTypeDisplay = (contactType: string) => {
    switch (contactType) {
      case 'PRIMARY':
        return 'Primary Contact';
      case 'ADMIN':
        return 'Administrative Contact';
      case 'SALES':
        return 'Sales Contact';
      case 'ACCOUNTS_PAYABLE':
        return 'Accounts Payable';
      case 'DISABLED':
        return 'Disabled';
      default:
        return contactType;
    }
  };

  const getDisplayTypeDisplay = (displayType: string) => {
    switch (displayType) {
      case 'NO_DISPLAY':
        return 'Do not display';
      case 'FULL_NAME_PHONE_EMAIL':
        return 'Full name, phone, and email';
      case 'GENERIC_NAME_PHONE_EMAIL':
        return 'Generic name, phone, and email';
      case 'PHONE_EMAIL_ONLY':
        return 'Phone and email only';
      default:
        return displayType;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Button onClick={handleAddContact} className="bg-greenyp-600 hover:bg-greenyp-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {!contacts || contacts.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts found</h3>
              <p className="text-gray-600">Get started by adding your first contact.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {contacts.map((contact) => (
            <Card key={contact.contactId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-greenyp-600 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {contact.genericContactName || `${contact.firstName} ${contact.lastName}`}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="default">
                        {getContactTypeDisplay(contact.producerContactType)}
                      </Badge>
                      {!contact.emailConfirmed && (
                        <Badge variant="destructive">
                          Email Unconfirmed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditContact(contact)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteContact(contact)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        {contact.title && (
                          <p className="text-sm text-gray-600">{contact.title}</p>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{contact.phoneNumber}</span>
                        </div>
                        
                        {contact.cellPhoneNumber && contact.cellPhoneNumber !== contact.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{contact.cellPhoneNumber}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{contact.emailAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Display Settings</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="text-gray-600">Display Type:</span> {getDisplayTypeDisplay(contact.displayContactType)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          existingContacts={contacts}
        />
      )}

      {selectedContact && locations && (
        <EditContactDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedContact(null);
          }}
          contact={{
            id: selectedContact.contactId,
            producerLocationId: selectedContact.producerLocationId,
            producerContactType: selectedContact.producerContactType,
            displayContactType: selectedContact.displayContactType,
            genericContactName: selectedContact.genericContactName,
            firstName: selectedContact.firstName,
            lastName: selectedContact.lastName,
            title: selectedContact.title,
            phoneNumber: selectedContact.phoneNumber,
            cellPhoneNumber: selectedContact.cellPhoneNumber,
            emailAddress: selectedContact.emailAddress,
            name: `${selectedContact.firstName} ${selectedContact.lastName}`,
            email: selectedContact.emailAddress,
            phone: selectedContact.phoneNumber,
            isPrimary: selectedContact.producerContactType === 'PRIMARY'
          }}
          locations={locations.map(loc => ({
            id: loc.locationId,
            locationName: loc.locationName
          }))}
          onContactUpdated={handleContactUpdated}
          existingContacts={contacts}
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
