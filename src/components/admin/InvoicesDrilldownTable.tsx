
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceFilters from './InvoiceFilters';
import InvoiceTable from './InvoiceTable';

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
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(mockInvoices);

  const handleFilteredInvoicesChange = (filtered: Invoice[]) => {
    setFilteredInvoices(filtered);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InvoiceFilters
          invoices={mockInvoices}
          onFilteredInvoicesChange={handleFilteredInvoicesChange}
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
