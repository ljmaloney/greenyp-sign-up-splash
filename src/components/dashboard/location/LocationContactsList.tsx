
import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useLocationContacts } from '@/hooks/useLocationContacts.ts';
import { Contact } from '@/services/contactService.ts';

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

  // Filter out disabled contacts
  const activeContacts = contacts?.filter(contact => contact.producerContactType !== 'DISABLED') || [];

  if (isLoading) {
    return (
      <div className="mt-6 pt-6 border-t">
        <div className="bg-gray-50 rounded-lg border p-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-greenyp-600" />
            <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
          </div>
          <p className="text-gray-600 text-sm mt-2">Loading contacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 pt-6 border-t">
        <div className="bg-gray-50 rounded-lg border p-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-greenyp-600" />
            <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
          </div>
          <p className="text-red-600 text-sm mt-2">Error loading contacts: {error.message}</p>
        </div>
      </div>
    );
  }

  const contactCount = activeContacts.length;

  return (
    <div className="mt-6 pt-6 border-t">
      <div className="bg-gray-50 rounded-lg border">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => contactCount > 0 && setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-greenyp-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Contacts ({contactCount})
            </h3>
          </div>
          {contactCount > 0 && (
            <div className="ml-2">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </div>
          )}
        </div>

        {contactCount === 0 ? (
          <div className="px-4 pb-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm pt-4">No active contacts assigned to this location.</p>
          </div>
        ) : (
          isExpanded && (
            <div className="px-4 pb-4 border-t border-gray-200">
              <div className="space-y-2 pt-4">
                {activeContacts.map((contact) => (
                  <div 
                    key={contact.contactId} 
                    className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border hover:border-gray-300 transition-colors"
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
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LocationContactsList;
