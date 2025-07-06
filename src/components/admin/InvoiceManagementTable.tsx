
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  },
  {
    id: 'INV-006',
    subscriberName: 'Botanical Landscapes',
    email: 'info@botanical.com',
    phone: '(555) 678-9012',
    producerId: 'PROD-006',
    amount: 199.99,
    subscriptionType: 'Enterprise',
    paymentDate: '2024-05-15',
    status: 'Paid'
  },
  {
    id: 'INV-007',
    subscriberName: 'Garden Innovations',
    email: 'contact@gardeninnovations.com',
    phone: '(555) 789-0123',
    producerId: 'PROD-007',
    amount: 89.99,
    subscriptionType: 'Premium',
    paymentDate: '2024-04-20',
    status: 'Paid'
  },
  {
    id: 'INV-008',
    subscriberName: 'Nature Works LLC',
    email: 'hello@natureworks.com',
    phone: '(555) 890-1234',
    producerId: 'PROD-008',
    amount: 29.99,
    subscriptionType: 'Basic',
    paymentDate: '2024-03-10',
    status: 'Paid'
  }
];

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
        <CardTitle>All Invoices</CardTitle>
        <div className="mt-4">
          <RadioGroup value={invoiceType} onValueChange={setInvoiceType} className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="classified" id="classified" />
              <Label htmlFor="classified">Display / Search Classified Invoices</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="subscriber" id="subscriber" />
              <Label htmlFor="subscriber">Display / Search Subscriber Invoices</Label>
            </div>
          </RadioGroup>
        </div>
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

export default InvoiceManagementTable;
