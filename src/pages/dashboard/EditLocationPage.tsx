
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const EditLocationPage = () => {
  const { locationId } = useParams<{ locationId: string }>();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Location</h1>
        <p className="text-gray-600">Edit location: {locationId}</p>
      </div>
    </DashboardLayout>
  );
};

export default EditLocationPage;
