
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import InvoicePageHeader from '@/components/admin/InvoicePageHeader';
import InvoiceManagementTable from '@/components/admin/InvoiceManagementTable';

const AdminInvoices = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <InvoicePageHeader />
        <InvoiceManagementTable />
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
