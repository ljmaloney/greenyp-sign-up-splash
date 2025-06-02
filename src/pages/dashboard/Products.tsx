
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardProductsList from '@/components/dashboard/DashboardProductsList';

const Products = () => {
  return (
    <DashboardLayout>
      <DashboardProductsList />
    </DashboardLayout>
  );
};

export default Products;
