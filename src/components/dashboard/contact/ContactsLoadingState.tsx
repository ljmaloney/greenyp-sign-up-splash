
import React from 'react';
import { Card, CardContent } from '@/components/ui/card.tsx';

const ContactsLoadingState = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsLoadingState;
