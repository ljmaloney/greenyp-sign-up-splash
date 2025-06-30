
import React from 'react';
import ContactTypeDisplay from './ContactTypeDisplay';
import ContactDisplayTypeDisplay from './ContactDisplayTypeDisplay';
import { Contact } from '@/services/accountService';

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
