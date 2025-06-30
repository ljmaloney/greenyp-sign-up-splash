
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail } from 'lucide-react';
import { Contact } from '@/services/accountService';

interface ContactInfoProps {
  contact: Contact;
}

const ContactInfo = ({ contact }: ContactInfoProps) => {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold">
        {contact.genericContactName || `${contact.firstName} ${contact.lastName}`}
      </h4>
      
      {contact.title && <p className="text-sm text-gray-600">{contact.title}</p>}
      
      <div className="space-y-2 text-sm">
        <div className="flex items-start">
          <div className="flex items-center gap-2 min-w-[80px]">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span className="text-gray-600">Phone:</span>
          </div>
          <span className="ml-2">{contact.phoneNumber}</span>
        </div>
        
        {contact.cellPhoneNumber && (
          <div className="flex items-start">
            <div className="flex items-center gap-2 min-w-[80px]">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="text-gray-600">Cell:</span>
            </div>
            <span className="ml-2">{contact.cellPhoneNumber}</span>
          </div>
        )}
        
        <div className="flex items-start">
          <div className="flex items-center gap-2 min-w-[80px]">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="text-gray-600">Email:</span>
          </div>
          <div className="ml-2 flex items-center gap-2">
            <span>{contact.emailAddress}</span>
            {!contact.emailConfirmed && (
              <Badge variant="destructive" className="text-xs">Unconfirmed</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
