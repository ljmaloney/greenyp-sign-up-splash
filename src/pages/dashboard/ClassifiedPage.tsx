
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const ClassifiedPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Classified Ads</h1>
        <p className="text-gray-600">Manage your classified advertisements.</p>
      </div>
    </DashboardLayout>
  );
};

export default ClassifiedPage;
