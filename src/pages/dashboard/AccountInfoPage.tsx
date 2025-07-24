
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const AccountInfoPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Information</h1>
        <p className="text-gray-600">Manage your account settings and information.</p>
      </div>
    </DashboardLayout>
  );
};

export default AccountInfoPage;
