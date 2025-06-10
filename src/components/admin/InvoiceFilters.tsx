
import React, { useState, useMemo } from 'react';
import InvoiceSearch from './InvoiceSearch';

interface Invoice {
  id: string;
  subscriberName: string;
  email: string;
  phone: string;
  producerId: string;
  amount: number;
  subscriptionType: string;
  paymentDate: string;
  status: string;
}

interface InvoiceFiltersProps {
  invoices: Invoice[];
  onFilteredInvoicesChange: (filteredInvoices: Invoice[]) => void;
}

const InvoiceFilters = ({ invoices, onFilteredInvoicesChange }: InvoiceFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = invoices.filter(invoice => {
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

      if (dateRange === 'custom' && startDate && endDate) {
        // Use custom date range
        filtered = filtered.filter(invoice => {
          const invoiceDate = new Date(invoice.paymentDate);
          return invoiceDate >= startDate && invoiceDate <= endDate;
        });
      } else {
        // Use preset date ranges
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

        if (dateRange !== 'custom') {
          filtered = filtered.filter(invoice => {
            const invoiceDate = new Date(invoice.paymentDate);
            return invoiceDate >= filterStartDate;
          });
        }
      }
    }

    return filtered;
  }, [invoices, searchTerm, searchType, dateRange, startDate, endDate]);

  // Notify parent component when filtered invoices change
  React.useEffect(() => {
    onFilteredInvoicesChange(filteredInvoices);
  }, [filteredInvoices, onFilteredInvoicesChange]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSearchType('all');
    setDateRange('all');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <InvoiceSearch
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
  );
};

export default InvoiceFilters;
