
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { Invoice } from '@/services/invoiceService.ts';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceHistoryTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  error: Error | null;
}

interface InvoiceRowProps {
  invoice: Invoice;
  isExpanded: boolean;
  onToggleExpand: (e: React.MouseEvent) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

// Separate component for main invoice row to avoid React.Fragment issues
const InvoiceRow: React.FC<InvoiceRowProps> = ({ 
  invoice, 
  isExpanded, 
  onToggleExpand,
  formatCurrency, 
  formatDate 
}) => {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="p-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleExpand}
        >
          {isExpanded ? 
            <ChevronDown className="h-4 w-4" /> : 
            <ChevronRight className="h-4 w-4" />}
        </Button>
      </TableCell>
      <TableCell className="font-medium">
        {invoice.invoiceNumber}
      </TableCell>
      <TableCell>
        {invoice.description || invoice.subscriptionName || 'N/A'}
      </TableCell>
      <TableCell>
        {invoice.paidDate ? formatDate(invoice.paidDate) : 'Unpaid'}
      </TableCell>
      <TableCell>
        {invoice.paymentReceiptNumber ? (
          <div className="flex items-center gap-1">
            {invoice.paymentReceiptUrl ? (
              <a 
                href={invoice.paymentReceiptUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                {invoice.paymentReceiptNumber}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              invoice.paymentReceiptNumber
            )}
          </div>
        ) : 'N/A'}
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(invoice.invoiceTotal)}
      </TableCell>
    </TableRow>
  );
};

// Separate component for line items to avoid React.Fragment issues
const LineItemsRow: React.FC<{ 
  invoice: Invoice;
  formatCurrency: (amount: number) => string;
}> = ({ invoice, formatCurrency }) => {
  if (!invoice.lineItems || invoice.lineItems.length === 0) return null;

  return (
    <TableRow>
      <TableCell colSpan={6} className="bg-gray-50 p-0">
        <div className="px-8 py-4">
          <h4 className="text-sm font-semibold mb-2">Line Items</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lineItems.map((item) => (
                <TableRow key={item.lineItemId}>
                  <TableCell className="text-center font-mono text-sm text-gray-500">
                    {item.lineNumber}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableCell>
    </TableRow>
  );
};

const InvoiceHistoryTable: React.FC<InvoiceHistoryTableProps> = ({ invoices, isLoading, error }) => {
  const [expandedInvoices, setExpandedInvoices] = useState<Record<string, boolean>>({});
  
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
  
  // Toggle expanded state for an invoice row
  const toggleExpand = (invoiceId: string) => (event: React.MouseEvent) => {
    // Prevent event bubbling
    event.stopPropagation();
    setExpandedInvoices(prev => ({
      ...prev,
      [invoiceId]: !prev[invoiceId]
    }));
  };
  
  // Check if an invoice row is expanded
  const isExpanded = (invoiceId: string): boolean => {
    return !!expandedInvoices[invoiceId];
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
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Generate the rows as independent elements with unique keys */}
                {invoices.flatMap(invoice => {
                  const expanded = isExpanded(invoice.invoiceId);
                  const results = [];
                  
                  // Push the main row
                  results.push(
                    <InvoiceRow 
                      key={`row-${invoice.invoiceId}`}
                      invoice={invoice} 
                      isExpanded={expanded}
                      onToggleExpand={toggleExpand(invoice.invoiceId)}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                    />
                  );
                  
                  // Push the expanded row if needed
                  if (expanded && invoice.lineItems && invoice.lineItems.length > 0) {
                    results.push(
                      <LineItemsRow 
                        key={`lineItems-${invoice.invoiceId}`}
                        invoice={invoice} 
                        formatCurrency={formatCurrency} 
                      />
                    );
                  }
                  
                  return results;
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceHistoryTable;
