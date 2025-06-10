
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InvoiceTableRow from './InvoiceTableRow';

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

interface InvoiceTableProps {
  invoices: Invoice[];
}

const InvoiceTable = ({ invoices }: InvoiceTableProps) => {
  return (
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
        {invoices.map((invoice) => (
          <InvoiceTableRow key={invoice.id} invoice={invoice} />
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoiceTable;
