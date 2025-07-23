import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Edit } from 'lucide-react';
import { useAccountData } from '@/hooks/useAccountData';
import { useInvoiceHistory } from '@/hooks/useInvoiceHistory';
import InvoiceDateRangeSelector from '@/components/dashboard/InvoiceDateRangeSelector';
import InvoiceHistoryTable from '@/components/dashboard/InvoiceHistoryTable';

const Payment = () => {
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;

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

  // Mock payment info
  const paymentInfo = {
    cardType: 'Visa',
    lastFour: '4242',
    expiryDate: '12/25',
    billingAddress: '123 Garden Street, San Francisco, CA 94102'
  };

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
              <div>
                <p className="text-sm text-gray-600">Card Type</p>
                <p className="font-medium">{paymentInfo.cardType} ending in {paymentInfo.lastFour}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expires</p>
                <p className="font-medium">{paymentInfo.expiryDate}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">{paymentInfo.billingAddress}</p>
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
