
import React from 'react';
import InvoiceSearch from './InvoiceSearch';
import { useInvoiceFilters } from '@/hooks/useInvoiceFilters';
import { Invoice } from '@/data/mockInvoices';

interface InvoiceFiltersProps {
  invoices: Invoice[];
  onFilteredInvoicesChange: (filteredInvoices: Invoice[]) => void;
}

const InvoiceFilters = ({ invoices }: InvoiceFiltersProps) => {
  const {
    searchTerm,
    searchType,
    dateRange,
    startDate,
    endDate,
    setSearchTerm,
    setSearchType,
    setDateRange,
    setStartDate,
    setEndDate,
    clearFilters
  } = useInvoiceFilters(invoices);

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
      onClearFilters={clearFilters}
    />
  );
};

export default InvoiceFilters;
