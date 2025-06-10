
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceFilters from './InvoiceFilters';
import InvoiceTable from './InvoiceTable';
import { mockInvoices } from '@/data/mockInvoices';
import { useInvoiceFilters } from '@/hooks/useInvoiceFilters';

const InvoicesDrilldownTable = () => {
  const {
    searchTerm,
    searchType,
    dateRange,
    startDate,
    endDate,
    filteredInvoices,
    setSearchTerm,
    setSearchType,
    setDateRange,
    setStartDate,
    setEndDate,
    clearFilters
  } = useInvoiceFilters(mockInvoices);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InvoiceFilters
          invoices={mockInvoices}
          onFilteredInvoicesChange={() => {}} // This prop is now handled internally by the hook
        />
        
        <div className="text-sm text-gray-600">
          Showing {filteredInvoices.length} of {mockInvoices.length} invoices
        </div>
        
        <InvoiceTable invoices={filteredInvoices} />
      </CardContent>
    </Card>
  );
};

export default InvoicesDrilldownTable;
