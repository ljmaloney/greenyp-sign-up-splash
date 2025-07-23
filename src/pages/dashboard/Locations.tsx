
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LocationsList from '@/components/dashboard/location/LocationsList.tsx';

const Locations = () => {
  return (
    <DashboardLayout>
      <LocationsList />
    </DashboardLayout>
  );
};

export default Locations;
