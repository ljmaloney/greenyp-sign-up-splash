
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Classified } from '@/types/classifieds';

interface SellerContactDisplayProps {
  classified: Classified;
}

const SellerContactDisplay = ({ classified }: SellerContactDisplayProps) => {
  const formatContact = (contact: string, type: 'email' | 'phone') => {
    if (!classified.contactObfuscated) {
      return contact;
    }
    
    if (type === 'email') {
      const [username, domain] = contact.split('@');
      return `${username.slice(0, 2)}***@${domain}`;
    } else {
      return `${contact.slice(0, 3)}***${contact.slice(-4)}`;
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center text-sm space-x-6">
        <div className="flex items-center">
          <Mail className="w-4 h-4 mr-2 text-greenyp-600" />
          <span className="text-gray-600">
            {formatContact(classified.email, 'email')}
          </span>
        </div>
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2 text-greenyp-600" />
          <span className="text-gray-600">
            {formatContact(classified.phone, 'phone')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SellerContactDisplay;
