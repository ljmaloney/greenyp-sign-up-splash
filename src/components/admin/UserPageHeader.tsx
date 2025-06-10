
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const UserPageHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">
          Manage user accounts, roles, and permissions
        </p>
      </div>
      <Button>
        <UserPlus className="h-4 w-4 mr-2" />
        Add User
      </Button>
    </div>
  );
};

export default UserPageHeader;
