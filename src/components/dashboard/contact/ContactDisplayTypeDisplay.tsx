
import React from 'react';

interface ContactDisplayTypeDisplayProps {
  displayType: string;
}

const ContactDisplayTypeDisplay = ({ displayType }: ContactDisplayTypeDisplayProps) => {
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
    <div className="text-sm">
      <span className="font-medium text-gray-700">Display Type:</span>
      <p className="text-gray-600 text-xs mt-1">
        {getDisplayTypeDisplay(displayType)}
      </p>
    </div>
  );
};

export default ContactDisplayTypeDisplay;
