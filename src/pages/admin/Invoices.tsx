
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import InvoicePageHeader from '@/components/admin/InvoicePageHeader';
import InvoiceManagementTable from '@/components/admin/InvoiceManagementTable';
import InvoiceTypeToggle from '@/components/admin/InvoiceTypeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminInvoices = () => {
  const [invoiceType, setInvoiceType] = useState<'classifieds' | 'subscribers'>('classifieds');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <InvoicePageHeader />
        
        {/* Invoice Type Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Management</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoiceTypeToggle 
              value={invoiceType} 
              onChange={setInvoiceType} 
            />
          </CardContent>
        </Card>

        <InvoiceManagementTable />
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
