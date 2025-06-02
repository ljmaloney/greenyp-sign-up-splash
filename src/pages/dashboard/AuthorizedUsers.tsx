
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AuthorizedUsersList from '@/components/dashboard/AuthorizedUsersList';

const AuthorizedUsers = () => {
  return (
    <DashboardLayout>
      <AuthorizedUsersList />
    </DashboardLayout>
  );
};

export default AuthorizedUsers;
