
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Users, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import type { Contact as ServiceContact } from '@/services/contactService.ts';

interface ContactCardProps {
  contact: ServiceContact;
  contacts: ServiceContact[];
  onEdit: (contact: ServiceContact) => void;
  onDelete: (contact: ServiceContact) => void;
  getLocationName: (locationId: string) => string;
}

const ContactCard = ({ contact, contacts, onEdit, onDelete, getLocationName }: ContactCardProps) => {
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

  const isDisabled = contact.producerContactType === 'DISABLED';

  // Count PRIMARY contacts
  const primaryContactsCount = contacts.filter(c => c.producerContactType === 'PRIMARY').length;

  // Don't show delete button for PRIMARY contacts if there's only 1
  const canDelete = !(contact.producerContactType === 'PRIMARY' && primaryContactsCount === 1);

  return (
    <Card key={contact.contactId} className={isDisabled ? 'opacity-75 bg-gray-50' : ''}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className={`text-xl flex items-center gap-2 ${
              isDisabled ? 'text-gray-500' : 'text-greenyp-600'
            }`}>
              <Users className="h-5 w-5" />
              {contact.genericContactName || `${contact.firstName} ${contact.lastName}`}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge 
                variant={isDisabled ? 'secondary' : 'default'}
                className={isDisabled ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : ''}
              >
                {getContactTypeDisplay(contact.producerContactType)}
              </Badge>
              {contact.emailAddress && !contact.emailConfirmed && (
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
              onClick={() => onEdit(contact)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            {canDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(contact)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
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
                  <Phone className="h-4 w-4 text-greenyp-600" />
                  <span>{contact.phoneNumber}</span>
                </div>

                {contact.cellPhoneNumber && contact.cellPhoneNumber !== contact.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-greenyp-600" />
                    <span>{contact.cellPhoneNumber}</span>
                  </div>
                )}

                {contact.emailAddress && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-greenyp-600" />
                    <span>{contact.emailAddress}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Location & Display Settings</h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-600 font-semibold">Location:</span>{' '}
                  <span className="text-gray-900">{getLocationName(contact.producerLocationId)}</span>
                </p>
                <p>
                  <span className="text-gray-600 font-semibold">Display Type:</span>{' '}
                  <span className="text-gray-900">{getDisplayTypeDisplay(contact.displayContactType)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
