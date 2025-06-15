
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ContactsErrorStateProps {
  error: Error;
}

const ContactsErrorState = ({ error }: ContactsErrorStateProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Error loading contacts</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsErrorState;
