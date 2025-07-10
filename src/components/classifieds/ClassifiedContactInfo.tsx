
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import { Classified } from '@/types/classifieds';

interface ClassifiedContactInfoProps {
  classified: Classified;
  hasProtectedContact: boolean;
  onContactSeller: () => void;
}

const ClassifiedContactInfo = ({ 
  classified, 
  hasProtectedContact, 
  onContactSeller 
}: ClassifiedContactInfoProps) => {
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
    <div className="border-t pt-6">
      <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
      <div className="space-y-3">
        <div className="flex items-center">
          <Mail className="w-5 h-5 mr-3 text-greenyp-600" />
          <span className="text-gray-700">
            {formatContact(classified.email, 'email')}
          </span>
        </div>
        <div className="flex items-center">
          <Phone className="w-5 h-5 mr-3 text-greenyp-600" />
          <span className="text-gray-700">
            {formatContact(classified.phone, 'phone')}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Button 
          className="bg-greenyp-600 hover:bg-greenyp-700 flex-1"
          onClick={onContactSeller}
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Email
        </Button>
        <Button 
          variant="outline"
          className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50 flex-1"
          onClick={() => window.open(`tel:${classified.phone}`, '_blank')}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Now
        </Button>
      </div>
    </div>
  );
};

export default ClassifiedContactInfo;
