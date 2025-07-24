
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const BusinessProfilePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
        <p className="text-gray-600">Manage your business profile information.</p>
      </div>
    </DashboardLayout>
  );
};

export default BusinessProfilePage;
