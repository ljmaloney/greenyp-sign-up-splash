
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const LocationsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
        <p className="text-gray-600">Manage your business locations.</p>
      </div>
    </DashboardLayout>
  );
};

export default LocationsPage;
