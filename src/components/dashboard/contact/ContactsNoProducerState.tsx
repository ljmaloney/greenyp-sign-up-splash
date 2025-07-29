
import React from 'react';
import { Card, CardContent } from '@/components/ui/card.tsx';

const ContactsNoProducerState = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Producer ID is required to load contacts</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsNoProducerState;
