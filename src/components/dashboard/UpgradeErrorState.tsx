
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const UpgradeErrorState = () => {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="text-red-600">
          <h1 className="text-2xl font-bold mb-2">Error Loading Data</h1>
          <p>Unable to load subscription plans. Please try again later.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UpgradeErrorState;
