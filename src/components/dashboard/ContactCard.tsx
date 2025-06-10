
import React from 'react';
import { Button } from "@/components/ui/button";
import { Users, Edit, Mail, Phone, Trash } from 'lucide-react';
import { Contact } from "@/types/contact";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
}

const ContactCard = ({ contact, onEdit, onDelete }: ContactCardProps) => {
  return (
    <div className="p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Users className="w-4 h-4 mr-2 text-greenyp-600" />
            <div className="flex items-center">
              <span className="font-medium text-gray-900">
                {contact.name}
                {contact.title && ` - ${contact.title}`}
              </span>
              {contact.isPrimary && (
                <span className="ml-2 px-2 py-1 bg-greenyp-100 text-greenyp-700 text-xs rounded-full">
                  Primary
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              <span>{contact.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              <span>{contact.phone}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(contact)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(contact.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
