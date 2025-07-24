
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const EditContactPage = () => {
  const { contactId } = useParams<{ contactId: string }>();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Contact</h1>
        <p className="text-gray-600">Edit contact: {contactId}</p>
      </div>
    </DashboardLayout>
  );
};

export default EditContactPage;
