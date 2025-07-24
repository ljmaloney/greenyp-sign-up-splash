
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const SubscriptionPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="text-gray-600">Manage your subscription plan.</p>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
