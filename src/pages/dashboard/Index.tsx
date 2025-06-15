
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BusinessProfile from '@/components/dashboard/BusinessProfile';

const DashboardIndex = () => {
  return (
    <DashboardLayout>
      <BusinessProfile />
    </DashboardLayout>
  );
};

export default DashboardIndex;
