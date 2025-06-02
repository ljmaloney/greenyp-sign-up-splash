
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardServicesList from '@/components/dashboard/DashboardServicesList';

const Services = () => {
  return (
    <DashboardLayout>
      <DashboardServicesList />
    </DashboardLayout>
  );
};

export default Services;
