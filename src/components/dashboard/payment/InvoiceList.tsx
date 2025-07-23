
import React, { useState, useEffect } from 'react';
import { useInvoiceHistory } from '@/hooks/useInvoiceHistory';
import InvoiceDateRangeSelector from '@/components/dashboard/payment/InvoiceDateRangeSelector.tsx';
import InvoiceHistoryTable from '@/components/dashboard/payment/InvoiceHistoryTable.tsx';

interface InvoiceListProps {
  producerId: string;
}

const InvoiceList = ({ producerId }: InvoiceListProps) => {
  // Date range state
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [searchDates, setSearchDates] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);

  // Initialize with last 12 months on component mount
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 12);
    
    setStartDate(start);
    setEndDate(end);
    
    // Auto-trigger initial search
    setSearchDates({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    });
  }, []);

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
