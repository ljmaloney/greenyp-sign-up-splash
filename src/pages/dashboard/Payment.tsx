
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAccountData } from '@/hooks/useAccountData';
import { usePaymentMethod } from '@/hooks/usePaymentMethod';
import { useUpdatePaymentMethod } from '@/hooks/useUpdatePaymentMethod';
import SavedPaymentMethod from '@/components/dashboard/payment/SavedPaymentMethod';
import SavedBillingAddress from '@/components/dashboard/payment/SavedBillingAddress';
import UpdatePaymentMethodDialog from '@/components/dashboard/payment/UpdatePaymentMethodDialog';
import UpdatePaymentMethod from '@/components/dashboard/payment/UpdatePaymentMethod';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

const Payment = () => {
  const { data: accountData } = useAccountData();
  const producerId = accountData?.producer?.producerId;
  
  // State for showing standalone update component
  const [showUpdatePaymentMethod, setShowUpdatePaymentMethod] = useState(false);

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
    isInitializing,
    initializationPhase,
    retryCount,
    cardContainerRef,
    openDialog,
    closeDialog,
    handleBillingContactChange,
    handleBillingAddressChange,
    handleUpdatePayment,
    retrySquareInitialization
  } = useUpdatePaymentMethod();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Payment Information</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowUpdatePaymentMethod(!showUpdatePaymentMethod)} className="flex items-center">
              <Edit className="w-4 h-4 mr-2" />
              {showUpdatePaymentMethod ? 'Hide Update Form' : 'Update Payment Method'}
            </Button>
          </div>
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
        <div className="grid gap-6 md:grid-cols-2">
          {/* Row 2 - UpdatePaymentMethod component when enabled */}
          {showUpdatePaymentMethod && producerId && (
            <div className="md:col-span-2">
              <UpdatePaymentMethod 
                producerId={producerId}
                onCancel={() => setShowUpdatePaymentMethod(false)}
              />
            </div>
          )}
        </div>



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
          isSquareInitializing={isInitializing}
          initializationPhase={initializationPhase}
          retryCount={retryCount}
          onSquareRetry={retrySquareInitialization}
          producerId={producerId} // Explicitly pass the producerId
        />
      </div>
    </DashboardLayout>
  );
};

export default Payment;
