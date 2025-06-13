
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-greenyp-600">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardContactCard;
