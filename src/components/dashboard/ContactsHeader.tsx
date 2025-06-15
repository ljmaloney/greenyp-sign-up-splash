
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContactsHeaderProps {
  onAddContact: () => void;
}

const ContactsHeader = ({ onAddContact }: ContactsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Contacts</h1>
      <Button onClick={onAddContact} className="bg-greenyp-600 hover:bg-greenyp-700">
        <Plus className="h-4 w-4 mr-2" />
        Add Contact
      </Button>
    </div>
  );
};

export default ContactsHeader;
