
import React from 'react';
import { Receipt } from 'lucide-react';

const InvoicePageHeader = () => {
  return (
    <div className="flex items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
        <p className="text-gray-600 mt-2">
          View and manage all subscriber invoices and payments
        </p>
      </div>
    </div>
  );
};

export default InvoicePageHeader;
