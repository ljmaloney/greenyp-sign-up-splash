
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceTypeSelector from './InvoiceTypeSelector';
import InvoiceFiltersContainer from './InvoiceFiltersContainer';
import InvoiceStats from './InvoiceStats';
import InvoiceTable from './InvoiceTable';
import { mockInvoices } from '@/data/mockInvoices';

const InvoiceManagementTable = () => {
  const [invoiceType, setInvoiceType] = useState('subscriber');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filteredInvoices = useMemo(() => {
    let filtered = mockInvoices;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = mockInvoices.filter(invoice => {
        switch (searchType) {
          case 'subscriberName':
            return invoice.subscriberName.toLowerCase().includes(term);
          case 'email':
            return invoice.email.toLowerCase().includes(term);
          case 'phone':
            return invoice.phone.toLowerCase().includes(term);
          case 'producerId':
            return invoice.producerId.toLowerCase().includes(term);
          case 'all':
          default:
            return (
              invoice.subscriberName.toLowerCase().includes(term) ||
              invoice.email.toLowerCase().includes(term) ||
              invoice.phone.toLowerCase().includes(term) ||
              invoice.producerId.toLowerCase().includes(term)
            );
        }
      });
    }

    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let filterStartDate = new Date();
      let filterEndDate = now;

      if (dateRange === 'custom') {
        if (startDate) filterStartDate = startDate;
        if (endDate) filterEndDate = endDate;
      } else {
        switch (dateRange) {
          case 'today':
            filterStartDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            filterStartDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            filterStartDate.setMonth(now.getMonth() - 1);
            break;
          case 'quarter':
            filterStartDate.setMonth(now.getMonth() - 3);
            break;
          case 'year':
            filterStartDate.setFullYear(now.getFullYear() - 1);
            break;
        }
      }

      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.paymentDate);
        return invoiceDate >= filterStartDate && invoiceDate <= filterEndDate;
      });
    }

    return filtered.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }, [searchTerm, searchType, dateRange, startDate, endDate]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSearchType('all');
    setDateRange('all');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Invoices</CardTitle>
        <InvoiceTypeSelector 
          invoiceType={invoiceType} 
          onInvoiceTypeChange={setInvoiceType} 
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <InvoiceFiltersContainer
          searchTerm={searchTerm}
          searchType={searchType}
          dateRange={dateRange}
          startDate={startDate}
          endDate={endDate}
          onSearchChange={setSearchTerm}
          onSearchTypeChange={setSearchType}
          onDateRangeChange={setDateRange}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClearFilters={handleClearFilters}
        />
        
        <InvoiceStats 
          filteredCount={filteredInvoices.length} 
          totalCount={mockInvoices.length} 
        />
        
        <InvoiceTable invoices={filteredInvoices} />
      </CardContent>
    </Card>
  );
};

export default InvoiceManagementTable;
