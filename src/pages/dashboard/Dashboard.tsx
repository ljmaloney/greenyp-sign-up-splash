
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BusinessProfile from '@/components/dashboard/BusinessProfile';
import { useLocationCache } from '@/hooks/useLocationCache';

const Dashboard = () => {
  // Preload locations when dashboard loads
  const { locations, isLoading } = useLocationCache();
  
  console.log('📍 Preloaded locations on dashboard:', locations?.length || 0);
  
  return (
    <DashboardLayout>
      <BusinessProfile />
    </DashboardLayout>
  );
};

export default Dashboard;
