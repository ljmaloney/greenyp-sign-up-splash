
import React from 'react';

interface ContactTypeDisplayProps {
  contactType: string;
}

const ContactTypeDisplay = ({ contactType }: ContactTypeDisplayProps) => {
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

  return (
    <div className="text-sm">
      <span className="font-medium text-gray-700">Contact Type:</span>
      <p className="text-gray-600 text-xs mt-1">
        {getContactTypeDisplay(contactType)}
      </p>
    </div>
  );
};

export default ContactTypeDisplay;
