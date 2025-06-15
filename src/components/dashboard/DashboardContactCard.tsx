
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail } from 'lucide-react';
import { Contact } from '@/services/accountService';

interface DashboardContactCardProps {
  contact: Contact;
  title: string;
  icon: React.ElementType;
}

const DashboardContactCard = ({ contact, title, icon: Icon }: DashboardContactCardProps) => {
  const getContactTypeDisplay = (contactType: string) => {
    switch (contactType) {
      case 'PRIMARY':
        return 'Primary Contact for display';
      case 'ADMIN':
        return 'Administrative Contact';
      case 'SALES':
        return 'Sales contact information for display';
      case 'ACCOUNTS_PAYABLE':
        return 'Contact for accounts payable';
      case 'DISABLED':
        return 'Contact has been disabled';
      default:
        return contactType;
    }
  };

  const getDisplayTypeDisplay = (displayType: string) => {
    switch (displayType) {
      case 'NO_DISPLAY':
        return 'Do not display contact in search results';
      case 'FULL_NAME_PHONE_EMAIL':
        return 'Display full name, phone, and email in results';
      case 'GENERIC_NAME_PHONE_EMAIL':
        return 'Display generic name, phone, and email';
      case 'PHONE_EMAIL_ONLY':
        return 'Display only phone and email in results';
      default:
        return displayType;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-greenyp-600">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <h4 className="font-semibold">
            {contact.genericContactName || `${contact.firstName} ${contact.lastName}`}
          </h4>
          
          {contact.title && <p className="text-sm text-gray-600">{contact.title}</p>}
          
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{contact.phoneNumber}</span>
            </div>
            {contact.cellPhoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{contact.cellPhoneNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{contact.emailAddress}</span>
              {!contact.emailConfirmed && (
                <Badge variant="destructive" className="text-xs">Unconfirmed</Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Contact Type:</span>
              <p className="text-gray-600 text-xs mt-1">
                {getContactTypeDisplay(contact.producerContactType)}
              </p>
            </div>
            
            <div className="text-sm">
              <span className="font-medium text-gray-700">Display Type:</span>
              <p className="text-gray-600 text-xs mt-1">
                {getDisplayTypeDisplay(contact.displayContactType)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardContactCard;
