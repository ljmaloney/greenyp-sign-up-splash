
import { useState, useMemo } from 'react';
import { Invoice } from '@/data/mockInvoices';

export const useInvoiceFilters = (invoices: Invoice[]) => {
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

  const clearFilters = () => {
    setSearchTerm('');
    setSearchType('all');
    setDateRange('all');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return {
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
  };
};
