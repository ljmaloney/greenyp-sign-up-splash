
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useStableSquarePayment } from '@/hooks/useStableSquarePayment';
import { useDashboardPaymentUpdate } from '@/hooks/useDashboardPaymentUpdate';
import { validatePaymentFields } from '@/utils/paymentValidation';
import PaymentInformationCard from './PaymentInformationCard';
import { BillingContactData, BillingAddressData } from '@/types/billing';

interface DashboardUpdatePaymentFormProps {
  producerId: string | undefined;
  onSuccess: () => void;
  onError: () => void;
  onCancel: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

const UpdatePaymentForm = ({
  producerId, 
  onSuccess, 
  onError, 
  onCancel,
  setIsSubmitting 
}: DashboardUpdatePaymentFormProps) => {
  // Payment states
  const {
    cardContainerRef,
    payments,
    card,
    error: squareError,
    setError: setSquareError,
    isInitialized,
    isInitializing,
    retryInitialization
  } = useStableSquarePayment();

  const { 
    isProcessing, 
    error: updateError,
    processDashboardPaymentUpdate 
  } = useDashboardPaymentUpdate({ 
    producerId,
    onSuccess,
    onError: () => {
      setIsSubmitting(false);
      onError();
    }
  });

  // Billing info states with company name
  const [billingContact, setBillingContact] = useState<BillingContactData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [billingAddress, setBillingAddress] = useState<BillingAddressData>({
    companyName: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleContactChange = (field: string, value: string) => {
    setBillingContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setBillingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate inputs
    const validationError = validatePaymentFields(billingContact, billingAddress);
    if (validationError) {
      setSquareError(validationError);
      return;
    }

    if (!card || !payments) {
      setSquareError('Payment form not fully loaded');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await processDashboardPaymentUpdate(
        card,
        payments,
        billingContact,
        billingAddress
      );
    } catch (error) {
      console.error('Payment update failed:', error);
      setIsSubmitting(false);
    }
  };

  const displayError = squareError || updateError;
  const isLoading = isInitializing || !isInitialized;

  return (
    <div className="space-y-6 py-2">
      {displayError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <PaymentInformationCard
          billingContact={billingContact}
          billingAddress={billingAddress}
          onBillingInfoChange={(contact, address) => {
            setBillingContact(contact);
            setBillingAddress(address);
          }}
        />

        <div className="bg-white rounded-md">
          <div id="card-container" ref={cardContainerRef} className="p-4 border border-gray-300 rounded-md min-h-[120px]" />
          {isLoading && (
            <div className="flex justify-center items-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Loading payment form...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || !card || !isInitialized}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Updating...
            </>
          ) : (
            'Update Payment Method'
          )}
        </Button>
      </div>
    </div>
  );
};

export default UpdatePaymentForm;
