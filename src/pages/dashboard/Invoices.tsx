import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAccountData } from '@/hooks/useAccountData';
import InvoiceList from '@/components/dashboard/payment/InvoiceList';

const Invoices = () => {
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Invoices & Billing History</h1>
        </div>
        
        {/* Invoice List Section - using default behavior (12 months, auto-search) */}
        {producerId && (
          <InvoiceList 
            producerId={producerId}
            autoSearch={true}
            defaultDateRangeMonths={12}
          />
        )}
        
        {!producerId && (
          <div className="text-center py-8 text-gray-500">
            Loading producer information...
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
