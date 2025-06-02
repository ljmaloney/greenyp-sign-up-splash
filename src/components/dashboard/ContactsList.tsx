
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Users, Plus, Edit, Mail, Phone, Trash, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";
import AddContactDialog from './AddContactDialog';
import EditContactDialog from './EditContactDialog';

interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  locationId?: string;
}

interface Location {
  id: string;
  locationName: string;
}

const ContactsList = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  // Mock contacts data with location associations
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Smith',
      title: 'Owner',
      email: 'john@greenlandscaping.com',
      phone: '(555) 123-4567',
      isPrimary: true,
      locationId: '1'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      title: 'Operations Manager',
      email: 'sarah@greenlandscaping.com',
      phone: '(555) 123-4568',
      isPrimary: false,
      locationId: '2'
    }
  ]);

  // Mock locations data for the dropdown
  const locations: Location[] = [
    { id: '1', locationName: 'Main Office' },
    { id: '2', locationName: 'Warehouse' },
    { id: '3', locationName: 'Retail Store' }
  ];

  const getLocationName = (locationId?: string) => {
    if (!locationId) return 'No Location';
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.locationName : 'Unknown Location';
  };

  const handleContactAdded = (newContactData: any) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: `${newContactData.firstName} ${newContactData.lastName}`,
      title: newContactData.genericContactName || 'Contact',
      email: newContactData.emailAddress,
      phone: newContactData.phoneNumber || newContactData.cellPhoneNumber,
      isPrimary: newContactData.producerContactType === 'PRIMARY',
      locationId: newContactData.producerLocationId
    };
    setContacts(prev => [...prev, newContact]);
  };

  const handleContactUpdated = (updatedContactData: any) => {
    if (editingContact) {
      const updatedContact: Contact = {
        ...editingContact,
        name: `${updatedContactData.firstName} ${updatedContactData.lastName}`,
        title: updatedContactData.genericContactName || editingContact.title,
        email: updatedContactData.emailAddress,
        phone: updatedContactData.phoneNumber || updatedContactData.cellPhoneNumber,
        isPrimary: updatedContactData.producerContactType === 'PRIMARY',
        locationId: updatedContactData.producerLocationId
      };
      setContacts(prev => prev.map(contact => 
        contact.id === editingContact.id ? updatedContact : contact
      ));
      setEditingContact(null);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    setIsDeleting(true);
    
    try {
      console.log('Deleting contact:', contactId);
      
      const response = await fetch(getApiUrl('/producer/contact'), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete contact: ${response.status}`);
      }

      toast({
        title: "Contact Deleted",
        description: "Contact has been successfully deleted.",
      });
      
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      setDeletingContactId(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
        <Button 
          className="bg-greenyp-600 hover:bg-greenyp-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="grid gap-6">
        {contacts.map((contact) => (
          <Card key={contact.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-greenyp-600" />
                  <div>
                    <div>{contact.name}</div>
                    <div className="flex items-center text-sm text-gray-500 font-normal">
                      <MapPin className="w-3 h-3 mr-1" />
                      {getLocationName(contact.locationId)}
                    </div>
                  </div>
                  {contact.isPrimary && (
                    <span className="ml-2 px-2 py-1 bg-greenyp-100 text-greenyp-700 text-xs rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingContact(contact)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingContactId(contact.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">{contact.title}</p>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{contact.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddContactDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        locations={locations}
        onContactAdded={handleContactAdded}
      />

      {editingContact && (
        <EditContactDialog 
          isOpen={!!editingContact}
          onClose={() => setEditingContact(null)}
          contact={editingContact}
          locations={locations}
          onContactUpdated={handleContactUpdated}
        />
      )}

      <AlertDialog open={!!deletingContactId} onOpenChange={() => setDeletingContactId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingContactId && handleDeleteContact(deletingContactId)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactsList;
