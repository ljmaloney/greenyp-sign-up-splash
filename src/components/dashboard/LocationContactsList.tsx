
import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationContacts } from '@/hooks/useLocationContacts';
import { Contact } from '@/services/contactService';

interface LocationContactsListProps {
  producerId: string;
  locationId: string;
  onEditContact?: (contact: Contact) => void;
  onDeleteContact?: (contact: Contact) => void;
}

const LocationContactsList = ({ 
  producerId, 
  locationId, 
  onEditContact, 
  onDeleteContact 
}: LocationContactsListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: contacts, isLoading, error } = useLocationContacts(producerId, locationId);

  const getDisplayName = (contact: Contact) => {
    if (contact.genericContactName) {
      return contact.genericContactName;
    }
    return `${contact.lastName}, ${contact.firstName}`;
  };

  if (isLoading) {
    return (
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-greenyp-600" />
          <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
        </div>
        <p className="text-gray-600 mt-2">Loading contacts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-greenyp-600" />
          <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
        </div>
        <p className="text-red-600 mt-2">Error loading contacts: {error.message}</p>
      </div>
    );
  }

  const contactCount = contacts?.length || 0;

  return (
    <div className="mt-6 pt-6 border-t">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center hover:bg-gray-50 rounded-lg p-2 -ml-2 transition-colors"
        >
          <Users className="w-5 h-5 mr-2 text-greenyp-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Contacts ({contactCount})
          </h3>
          {contactCount > 0 && (
            <div className="ml-2">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </div>
          )}
        </button>
      </div>

      {contactCount === 0 ? (
        <p className="text-gray-600">No contacts assigned to this location.</p>
      ) : (
        isExpanded && (
          <div className="space-y-2">
            {contacts?.map((contact) => (
              <div 
                key={contact.contactId} 
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {getDisplayName(contact)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{contact.emailAddress}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{contact.phoneNumber}</span>
                  </div>
                </div>
                <div className="flex gap-1 ml-4">
                  {onEditContact && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditContact(contact)}
                      className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                  {onDeleteContact && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteContact(contact)}
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default LocationContactsList;
