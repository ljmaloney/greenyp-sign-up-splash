
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
  
  // State for enabling/disabling the update payment method card
  const [updatePaymentMethodEnabled, setUpdatePaymentMethodEnabled] = useState(false);

  // Fetch payment method data
  const { data: paymentMethod, isLoading: paymentLoading, error: paymentError } = usePaymentMethod(producerId || '');

  // Set initial disabled state based on whether payment method exists (2XX response means disabled initially)
  React.useEffect(() => {
    if (!paymentLoading && !paymentError && paymentMethod) {
      // Payment method exists (2XX response), so card should be disabled initially
      setUpdatePaymentMethodEnabled(false);
    }
  }, [paymentMethod, paymentLoading, paymentError]);

  // Map PaymentMethod data to BillingInfo structure for pre-population (memoized to prevent infinite loops)
  const initialBillingInfo = React.useMemo(() => {
    if (!paymentMethod) return undefined;

    // Extract name from cardholderName or use empty strings
    const cardholderName = paymentMethod.cardDetails?.cardholderName || '';
    const nameParts = cardholderName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      firstName,
      lastName,
      email: paymentMethod.emailAddress || '',
      phone: paymentMethod.phoneNumber || '',
      company: '', // Not available in PaymentMethod
      address: paymentMethod.payorAddress1 || '',
      address2: paymentMethod.payorAddress2 || '',
      city: paymentMethod.payorCity || '',
      state: paymentMethod.payorState || '',
      zipCode: paymentMethod.payorPostalCode || ''
    };
  }, [paymentMethod]);

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
            <Button 
              onClick={() => setUpdatePaymentMethodEnabled(true)} 
              className="flex items-center"
              disabled={updatePaymentMethodEnabled}
            >
              <Edit className="w-4 h-4 mr-2" />
              {updatePaymentMethodEnabled ? 'Update Form Enabled' : 'Update Payment Method'}
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
          {/* Row 2 - UpdatePaymentMethod component - always shown but can be disabled */}
          {producerId && (
            <div className="md:col-span-2">
              <UpdatePaymentMethod 
                producerId={producerId}
                onCancel={() => setUpdatePaymentMethodEnabled(false)}
                disabled={!updatePaymentMethodEnabled}
                initialBillingInfo={initialBillingInfo}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payment;
