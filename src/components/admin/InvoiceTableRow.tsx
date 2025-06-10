
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

interface InvoiceTableRowProps {
  invoice: Invoice;
}

const InvoiceTableRow = ({ invoice }: InvoiceTableRowProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'secondary';
      case 'Failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <TableRow>
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
  );
};

export default InvoiceTableRow;
