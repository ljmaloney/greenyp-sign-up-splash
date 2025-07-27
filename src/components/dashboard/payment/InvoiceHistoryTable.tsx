
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { Invoice, LineItem } from '@/services/invoiceService.ts';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceHistoryTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  error: Error | null;
}

const InvoiceHistoryTable = ({ invoices, isLoading, error }: InvoiceHistoryTableProps) => {
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
  const toggleExpand = (invoiceId: string, event: React.MouseEvent) => {
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
  
  // Render line items for an expanded invoice
  const renderLineItems = (invoice: Invoice) => {
    if (!invoice.lineItems || invoice.lineItems.length === 0) return null;
    
    return (
      <TableRow data-expanded-content="true">
        <TableCell colSpan={6} className="bg-gray-50 p-0">
          <div className="px-8 py-4">
            <h4 className="text-sm font-semibold mb-2">Line Items</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lineItems.map((item) => (
                  <TableRow key={item.lineItemId}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
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
                {invoices.map((invoice) => {
                  const isRowExpanded = isExpanded(invoice.invoiceId);
                  return (
                    <React.Fragment key={invoice.invoiceId}>
                      {/* Main invoice row */}
                      <TableRow className="cursor-pointer hover:bg-gray-50" 
                              data-invoice-row={invoice.invoiceId}>
                        <TableCell className="p-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => toggleExpand(invoice.invoiceId, e)}
                          >
                            {isRowExpanded ? 
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
                      
                      {/* Expanded line items row */}
                      {isRowExpanded && invoice.lineItems && invoice.lineItems.length > 0 && 
                        <TableRow data-expanded-row={invoice.invoiceId}>
                          <TableCell colSpan={6} className="bg-gray-50 p-0">
                            <div className="px-8 py-4">
                              <h4 className="text-sm font-semibold mb-2">Line Items</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {invoice.lineItems.map((item) => (
                                    <TableRow key={item.lineItemId}>
                                      <TableCell>{item.description}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      }
                    </React.Fragment>
                  );
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
