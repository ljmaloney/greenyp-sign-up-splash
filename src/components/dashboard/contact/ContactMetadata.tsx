
import React from 'react';
import ContactTypeDisplay from './ContactTypeDisplay.tsx';
import ContactDisplayTypeDisplay from './ContactDisplayTypeDisplay.tsx';
import { Contact } from '@/services/accountService.ts';

interface ContactMetadataProps {
  contact: Contact;
}

const ContactMetadata = ({ contact }: ContactMetadataProps) => {
  return (
    <div className="space-y-2 pt-2 border-t">
      <ContactTypeDisplay contactType={contact.producerContactType} />
      <ContactDisplayTypeDisplay displayType={contact.displayContactType} />
    </div>
  );
};

export default ContactMetadata;
