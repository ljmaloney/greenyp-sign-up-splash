
import React from 'react';

interface InvoiceStatsProps {
  filteredCount: number;
  totalCount: number;
}

const InvoiceStats = ({ filteredCount, totalCount }: InvoiceStatsProps) => {
  return (
    <div className="text-sm text-gray-600">
      Showing {filteredCount} of {totalCount} invoices
    </div>
  );
};

export default InvoiceStats;
