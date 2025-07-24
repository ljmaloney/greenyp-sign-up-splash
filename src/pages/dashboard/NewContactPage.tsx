
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const NewContactPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Contact</h1>
        <p className="text-gray-600">Add a new business contact.</p>
      </div>
    </DashboardLayout>
  );
};

export default NewContactPage;
