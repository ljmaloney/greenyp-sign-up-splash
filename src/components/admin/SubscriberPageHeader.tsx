
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const SubscriberPageHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscriber Management</h1>
        <p className="text-gray-600 mt-2">
          Search and manage subscriber accounts and subscriptions
        </p>
      </div>
      <Button>
        <UserPlus className="h-4 w-4 mr-2" />
        Add Subscriber
      </Button>
    </div>
  );
};

export default SubscriberPageHeader;
