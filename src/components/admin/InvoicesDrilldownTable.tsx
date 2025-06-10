
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    subscriberName: 'Green Valley Nursery',
    email: 'contact@greenvalley.com',
    phone: '(555) 123-4567',
    producerId: 'PROD-001',
    amount: 89.99,
    subscriptionType: 'Premium',
    paymentDate: '2024-06-09',
    status: 'Paid'
  },
  {
    id: 'INV-002',
    subscriberName: 'Urban Garden Design',
    email: 'info@urbangardens.com',
    phone: '(555) 234-5678',
    producerId: 'PROD-002',
    amount: 29.99,
    subscriptionType: 'Basic',
    paymentDate: '2024-06-08',
    status: 'Paid'
  },
  {
    id: 'INV-003',
    subscriberName: 'EcoScape Solutions',
    email: 'hello@ecoscape.com',
    phone: '(555) 345-6789',
    producerId: 'PROD-003',
    amount: 199.99,
    subscriptionType: 'Enterprise',
    paymentDate: '2024-06-07',
    status: 'Paid'
  },
  {
    id: 'INV-004',
    subscriberName: 'Natural Landscaping Co',
    email: 'sales@naturallc.com',
    phone: '(555) 456-7890',
    producerId: 'PROD-004',
    amount: 89.99,
    subscriptionType: 'Premium',
    paymentDate: '2024-06-06',
    status: 'Pending'
  },
  {
    id: 'INV-005',
    subscriberName: 'Sustainable Gardens LLC',
    email: 'team@sustainablegardens.com',
    phone: '(555) 567-8901',
    producerId: 'PROD-005',
    amount: 29.99,
    subscriptionType: 'Basic',
    paymentDate: '2024-06-05',
    status: 'Failed'
  }
];

const InvoicesDrilldownTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

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
  }, [searchTerm, searchType, dateRange, startDate, endDate]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSearchType('all');
    setDateRange('all');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'secondary';
      case 'Failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        
        <div className="text-sm text-gray-600">
          Showing {filteredInvoices.length} of {mockInvoices.length} invoices
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Subscriber Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Producer ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.subscriberName}</TableCell>
                <TableCell>{invoice.email}</TableCell>
                <TableCell>{invoice.phone}</TableCell>
                <TableCell>{invoice.producerId}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>{new Date(invoice.paymentDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InvoicesDrilldownTable;
