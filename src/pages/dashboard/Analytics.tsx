
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AnalyticsPageHeader from '@/components/admin/AnalyticsPageHeader';
import SubscriberStatsCards from '@/components/admin/SubscriberStatsCards';
import SubscriberChart from '@/components/admin/SubscriberChart';
import InvoiceStatsCard from '@/components/admin/InvoiceStatsCard';
import SubscribersDrilldownTable from '@/components/admin/SubscribersDrilldownTable';
import InvoicesDrilldownTable from '@/components/admin/InvoicesDrilldownTable';

const DashboardAnalytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AnalyticsPageHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SubscriberStatsCards />
          <InvoiceStatsCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubscriberChart />
        </div>

        <div className="space-y-6">
          <SubscribersDrilldownTable />
          <InvoicesDrilldownTable />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardAnalytics;
