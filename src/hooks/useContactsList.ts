
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";
import { Contact, Location } from "@/types/contact";

export const useContactsList = () => {
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

  const [openLocations, setOpenLocations] = useState<Record<string, boolean>>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const locations: Location[] = [
    { id: '1', locationName: 'Main Office' },
    { id: '2', locationName: 'Warehouse' },
    { id: '3', locationName: 'Retail Store' }
  ];

  const groupedContacts = contacts.reduce((groups, contact) => {
    const locationId = contact.locationId || 'no-location';
    if (!groups[locationId]) {
      groups[locationId] = [];
    }
    groups[locationId].push(contact);
    return groups;
  }, {} as Record<string, Contact[]>);

  const toggleLocation = (locationId: string) => {
    setOpenLocations(prev => ({
      ...prev,
      [locationId]: !prev[locationId]
    }));
  };

  const handleContactAdded = (newContactData: any) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: `${newContactData.firstName} ${newContactData.lastName}`,
      title: newContactData.title || 'Contact',
      email: newContactData.emailAddress,
      phone: newContactData.phoneNumber || newContactData.cellPhoneNumber,
      isPrimary: newContactData.producerContactType === 'PRIMARY',
      locationId: newContactData.producerLocationId
    };
    setContacts(prev => [...prev, newContact]);
  };

  const handleContactUpdated = (updatedContactData: any, editingContact: Contact) => {
    const updatedContact: Contact = {
      ...editingContact,
      name: `${updatedContactData.firstName} ${updatedContactData.lastName}`,
      title: updatedContactData.title || editingContact.title,
      email: updatedContactData.emailAddress,
      phone: updatedContactData.phoneNumber || updatedContactData.cellPhoneNumber,
      isPrimary: updatedContactData.producerContactType === 'PRIMARY',
      locationId: updatedContactData.producerLocationId
    };
    setContacts(prev => prev.map(contact => 
      contact.id === editingContact.id ? updatedContact : contact
    ));
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

  return {
    contacts,
    locations,
    groupedContacts,
    openLocations,
    isDeleting,
    toggleLocation,
    handleContactAdded,
    handleContactUpdated,
    handleDeleteContact
  };
};
