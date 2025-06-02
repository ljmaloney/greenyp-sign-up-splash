
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Edit, Mail, Phone } from 'lucide-react';
import AddContactDialog from './AddContactDialog';
import EditContactDialog from './EditContactDialog';

interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

interface Location {
  id: string;
  locationName: string;
}

const ContactsList = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  // Mock contacts data
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Smith',
      title: 'Owner',
      email: 'john@greenlandscaping.com',
      phone: '(555) 123-4567',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      title: 'Operations Manager',
      email: 'sarah@greenlandscaping.com',
      phone: '(555) 123-4568',
      isPrimary: false
    }
  ]);

  // Mock locations data for the dropdown
  const locations: Location[] = [
    { id: '1', locationName: 'Main Office' },
    { id: '2', locationName: 'Warehouse' },
    { id: '3', locationName: 'Retail Store' }
  ];

  const handleContactAdded = (newContactData: any) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: `${newContactData.firstName} ${newContactData.lastName}`,
      title: newContactData.genericContactName || 'Contact',
      email: newContactData.emailAddress,
      phone: newContactData.phoneNumber || newContactData.cellPhoneNumber,
      isPrimary: newContactData.producerContactType === 'PRIMARY'
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
        isPrimary: updatedContactData.producerContactType === 'PRIMARY'
      };
      setContacts(prev => prev.map(contact => 
        contact.id === editingContact.id ? updatedContact : contact
      ));
      setEditingContact(null);
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
                  {contact.name}
                  {contact.isPrimary && (
                    <span className="ml-2 px-2 py-1 bg-greenyp-100 text-greenyp-700 text-xs rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingContact(contact)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
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
          onContactUpdated={handleContactUpdated}
        />
      )}
    </div>
  );
};

export default ContactsList;
