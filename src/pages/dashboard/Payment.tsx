
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAccountData } from '@/hooks/useAccountData';
import { usePaymentMethod } from '@/hooks/usePaymentMethod';
import SavedPaymentMethod from '@/components/dashboard/payment/SavedPaymentMethod';
import SavedBillingAddress from '@/components/dashboard/payment/SavedBillingAddress';
import InvoiceList from '@/components/dashboard/payment/InvoiceList';

const Payment = () => {
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;

  // Fetch payment method data
  const { data: paymentMethod, isLoading: paymentLoading, error: paymentError } = usePaymentMethod(producerId || '');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Information</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <SavedPaymentMethod
            paymentMethod={paymentMethod}
            isLoading={paymentLoading}
            error={paymentError}
          />
          
          <SavedBillingAddress
            paymentMethod={paymentMethod}
            isLoading={paymentLoading}
            error={paymentError}
          />
        </div>

        {/* Invoice List Section */}
        {producerId && <InvoiceList producerId={producerId} />}
      </div>
    </DashboardLayout>
  );
};

export default Payment;
