
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

// Mock data for invoice statistics
const invoiceStats = {
  totalPaid: 47250,
  thisMonth: 8900,
  growth: '+15.3%'
};

const InvoiceStatsCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          Total Invoices Paid
        </CardTitle>
        <DollarSign className="h-4 w-4 text-gray-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${invoiceStats.totalPaid.toLocaleString()}
        </div>
        <p className="text-xs text-green-600 flex items-center mt-1">
          {invoiceStats.growth} this month (${invoiceStats.thisMonth.toLocaleString()})
        </p>
      </CardContent>
    </Card>
  );
};

export default InvoiceStatsCard;
