
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Edit } from 'lucide-react';
import { useAccountData } from '@/hooks/useAccountData';
import { useInvoiceHistory } from '@/hooks/useInvoiceHistory';
import { usePaymentMethod } from '@/hooks/usePaymentMethod';
import InvoiceDateRangeSelector from '@/components/dashboard/InvoiceDateRangeSelector';
import InvoiceHistoryTable from '@/components/dashboard/InvoiceHistoryTable';

const Payment = () => {
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;

  // Fetch payment method data
  const { data: paymentMethod, isLoading: paymentLoading, error: paymentError } = usePaymentMethod(producerId || '');

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

  // Format card expiry date
  const formatExpiryDate = (month: number, year: number) => {
    if (!month || !year) return 'N/A';
    const monthStr = month.toString().padStart(2, '0');
    const yearStr = year.toString().slice(-2);
    return `${monthStr}/${yearStr}`;
  };

  // Format billing address
  const formatBillingAddress = () => {
    if (!paymentMethod) return 'No address on file';
    
    const parts = [
      paymentMethod.payorAddress1,
      paymentMethod.payorAddress2,
      `${paymentMethod.payorCity}, ${paymentMethod.payorState} ${paymentMethod.payorPostalCode}`
    ].filter(Boolean);
    
    return parts.join(', ') || 'No address on file';
  };

  // Check if error is a 404 (no payment method found)
  const isPaymentMethodNotFound = paymentError?.message?.includes('404');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Information</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-greenyp-600" />
                  Payment Method
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Update
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentLoading ? (
                <p className="text-gray-600">Loading payment method...</p>
              ) : paymentError ? (
                <p className="text-gray-600">
                  {isPaymentMethodNotFound 
                    ? "No payment method on file. Add a payment method to get started." 
                    : "Error loading payment method"
                  }
                </p>
              ) : paymentMethod ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Card Type</p>
                    <p className="font-medium">
                      {paymentMethod.cardDetails.cardBrand} ending in {paymentMethod.cardDetails.last4}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expires</p>
                    <p className="font-medium">
                      {formatExpiryDate(paymentMethod.cardDetails.expMonth, paymentMethod.cardDetails.expYear)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cardholder Name</p>
                    <p className="font-medium">{paymentMethod.cardDetails.cardholderName || 'N/A'}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">No payment method on file</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentLoading ? (
                <p className="text-gray-600">Loading billing address...</p>
              ) : paymentError ? (
                <p className="text-gray-600">
                  {isPaymentMethodNotFound 
                    ? "No billing address on file. Add a payment method to set up billing address." 
                    : "Error loading billing address"
                  }
                </p>
              ) : paymentMethod ? (
                <>
                  <p className="text-gray-900">{formatBillingAddress()}</p>
                  {paymentMethod.phoneNumber && (
                    <p className="text-gray-600 mt-2">Phone: {paymentMethod.phoneNumber}</p>
                  )}
                  {paymentMethod.emailAddress && (
                    <p className="text-gray-600">Email: {paymentMethod.emailAddress}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-600">No billing address on file</p>
              )}
              <Button variant="outline" size="sm" className="mt-4">
                <Edit className="w-4 h-4 mr-2" />
                Update Address
              </Button>
            </CardContent>
          </Card>
        </div>

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
    </DashboardLayout>
  );
};

export default Payment;
