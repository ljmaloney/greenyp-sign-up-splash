
import React from 'react';
import InvoiceSearch from './InvoiceSearch';

interface InvoiceFiltersContainerProps {
  searchTerm: string;
  searchType: string;
  dateRange: string;
  startDate?: Date;
  endDate?: Date;
  onSearchChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onClearFilters: () => void;
}

const InvoiceFiltersContainer = ({
  searchTerm,
  searchType,
  dateRange,
  startDate,
  endDate,
  onSearchChange,
  onSearchTypeChange,
  onDateRangeChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters
}: InvoiceFiltersContainerProps) => {
  return (
    <InvoiceSearch
      searchTerm={searchTerm}
      searchType={searchType}
      dateRange={dateRange}
      startDate={startDate}
      endDate={endDate}
      onSearchChange={onSearchChange}
      onSearchTypeChange={onSearchTypeChange}
      onDateRangeChange={onDateRangeChange}
      onStartDateChange={onStartDateChange}
      onEndDateChange={onEndDateChange}
      onClearFilters={onClearFilters}
    />
  );
};

export default InvoiceFiltersContainer;
