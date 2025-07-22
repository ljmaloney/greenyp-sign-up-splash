
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Invoice } from '@/services/invoiceService';
import { format } from 'date-fns';

interface InvoiceHistoryTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  error: Error | null;
}

const InvoiceHistoryTable = ({ invoices, isLoading, error }: InvoiceHistoryTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // Check if the error is a 404 error related to invoice fetching
  const is404Error = (error: Error) => {
    return error.message.includes('404') && error.message.includes('not found');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-600">Loading billing history...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-red-600">
              {is404Error(error) 
                ? "No Invoices found for the selected date range" 
                : `Error loading billing history: ${error.message}`
              }
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-600">No invoices found for the selected date range.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Create Date</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoiceId}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      {invoice.subscriptionName}
                    </TableCell>
                    <TableCell>
                      {formatDate(invoice.createDate)}
                    </TableCell>
                    <TableCell>
                      {invoice.paidDate ? formatDate(invoice.paidDate) : 'Unpaid'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(invoice.invoiceTotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceHistoryTable;
