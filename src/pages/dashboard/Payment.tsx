
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAccountData } from '@/hooks/useAccountData';
import { usePaymentMethod } from '@/hooks/usePaymentMethod';
import { useUpdatePaymentMethod } from '@/hooks/useUpdatePaymentMethod';
import SavedPaymentMethod from '@/components/dashboard/payment/SavedPaymentMethod';
import SavedBillingAddress from '@/components/dashboard/payment/SavedBillingAddress';
import InvoiceList from '@/components/dashboard/payment/InvoiceList';
import UpdatePaymentMethodDialog from '@/components/dashboard/payment/UpdatePaymentMethodDialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

const Payment = () => {
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;

  // Fetch payment method data
  const { data: paymentMethod, isLoading: paymentLoading, error: paymentError } = usePaymentMethod(producerId || '');

  // Update payment method functionality
  const {
    isDialogOpen,
    isProcessing,
    billingContact,
    billingAddress,
    squareError,
    isInitialized,
    cardContainerRef,
    openDialog,
    closeDialog,
    handleBillingContactChange,
    handleBillingAddressChange,
    handleUpdatePayment
  } = useUpdatePaymentMethod();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Payment Information</h1>
          <Button onClick={openDialog} className="flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Update Payment Method
          </Button>
        </div>
        
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

        {/* Invoice List Section - using default behavior (12 months, auto-search) */}
        {producerId && (
          <InvoiceList 
            producerId={producerId}
            autoSearch={true}
            defaultDateRangeMonths={12}
          />
        )}

        {/* Update Payment Method Dialog */}
        <UpdatePaymentMethodDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          isProcessing={isProcessing}
          billingContact={billingContact}
          billingAddress={billingAddress}
          onBillingContactChange={handleBillingContactChange}
          onBillingAddressChange={handleBillingAddressChange}
          onUpdatePayment={handleUpdatePayment}
          cardContainerRef={cardContainerRef}
          squareError={squareError}
          isSquareReady={isInitialized}
        />
      </div>
    </DashboardLayout>
  );
};

export default Payment;
