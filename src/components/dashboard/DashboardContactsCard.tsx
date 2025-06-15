
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Mail, Phone } from 'lucide-react';
import { Contact } from '@/services/accountService';

interface DashboardContactsCardProps {
  contacts: Contact[];
}

const DashboardContactsCard = ({ contacts }: DashboardContactsCardProps) => {
  const primaryContact = contacts.find(contact => contact.producerContactType === 'PRIMARY');
  const otherContacts = contacts.filter(contact => contact.producerContactType !== 'PRIMARY');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-greenyp-600">
          <Users className="h-5 w-5" />
          Contacts ({contacts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {primaryContact && (
            <div className="p-3 bg-greenyp-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-greenyp-800">
                  {primaryContact.firstName} {primaryContact.lastName}
                </span>
                <span className="px-2 py-1 bg-greenyp-200 text-greenyp-700 text-xs rounded-full">
                  Primary
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span>{primaryContact.emailAddress}</span>
                </div>
                {primaryContact.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{primaryContact.phoneNumber}</span>
                  </div>
                )}
                {primaryContact.title && (
                  <div className="text-xs text-gray-500">
                    {primaryContact.title}
                  </div>
                )}
              </div>
            </div>
          )}

          {otherContacts.length > 0 && (
            <div className="space-y-2">
              {otherContacts.map((contact) => (
                <div key={contact.contactId} className="p-2 border rounded">
                  <div className="font-medium text-sm">
                    {contact.firstName} {contact.lastName}
                  </div>
                  <div className="text-xs text-gray-600">
                    {contact.emailAddress}
                    {contact.title && ` • ${contact.title}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardContactsCard;
