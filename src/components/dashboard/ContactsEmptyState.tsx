
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

const ContactsEmptyState = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-600">Get started by adding your first contact.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsEmptyState;
