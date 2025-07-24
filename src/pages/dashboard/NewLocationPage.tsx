
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const NewLocationPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Location</h1>
        <p className="text-gray-600">Add a new business location.</p>
      </div>
    </DashboardLayout>
  );
};

export default NewLocationPage;
