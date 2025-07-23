
import React, { useState, useEffect } from 'react';
import { useInvoiceHistory } from '@/hooks/useInvoiceHistory';
import InvoiceDateRangeSelector from '@/components/dashboard/payment/InvoiceDateRangeSelector.tsx';
import InvoiceHistoryTable from '@/components/dashboard/payment/InvoiceHistoryTable.tsx';

interface InvoiceListProps {
  producerId: string;
  initialStartDate?: Date;
  initialEndDate?: Date;
  autoSearch?: boolean;
  defaultDateRangeMonths?: number;
}

const InvoiceList = ({ 
  producerId,
  initialStartDate,
  initialEndDate,
  autoSearch = true,
  defaultDateRangeMonths = 12
}: InvoiceListProps) => {
  // Date range state
  const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate);
  const [searchDates, setSearchDates] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);

  // Initialize dates and search behavior
  useEffect(() => {
    // Only set default dates if they weren't provided as props
    if (!initialStartDate || !initialEndDate) {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - defaultDateRangeMonths);
      
      if (!initialStartDate) {
        setStartDate(start);
      }
      if (!initialEndDate) {
        setEndDate(end);
      }
      
      // Auto-trigger search only if autoSearch is enabled
      if (autoSearch) {
        setSearchDates({
          startDate: (initialStartDate || start).toISOString().split('T')[0],
          endDate: (initialEndDate || end).toISOString().split('T')[0]
        });
      }
    } else if (autoSearch) {
      // If both dates are provided and autoSearch is enabled, trigger search immediately
      setSearchDates({
        startDate: initialStartDate.toISOString().split('T')[0],
        endDate: initialEndDate.toISOString().split('T')[0]
      });
    }
  }, [initialStartDate, initialEndDate, autoSearch, defaultDateRangeMonths]);

  // Fetch invoice history
  const { data: invoices = [], isLoading, error } = useInvoiceHistory({
    producerId: producerId || '',
    startDate: searchDates?.startDate || '',
    endDate: searchDates?.endDate || ''
  });

  const handleSearch = () => {
    if (startDate && endDate) {
      setSearchDates({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <InvoiceDateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSearch={handleSearch}
      />

      {/* Invoice History Table */}
      <InvoiceHistoryTable
        invoices={invoices}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default InvoiceList;
