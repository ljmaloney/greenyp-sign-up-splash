
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useStableSquarePayment } from '@/hooks/useStableSquarePayment';
import { usePaymentUpdate } from '@/hooks/usePaymentUpdate';
import { validatePaymentFields } from '@/utils/paymentValidation';
import PaymentInformationCard from '@/components/payment/PaymentInformationCard';
import EmailValidationCard from '@/components/payment/EmailValidationCard';

interface UpdatePaymentFormProps {
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
}: UpdatePaymentFormProps) => {
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
    processPaymentUpdate 
  } = usePaymentUpdate({ 
    producerId,
    onSuccess,
    onError: () => {
      setIsSubmitting(false);
      onError();
    }
  });

  // Billing info states
  const [billingContact, setBillingContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [billingAddress, setBillingAddress] = useState({
    companyName: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Email validation states
  const [emailValidationToken, setEmailValidationToken] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleValidateEmail = () => {
    setIsValidating(true);
    setValidationError(null);
    
    // Simulate email validation for now
    setTimeout(() => {
      if (emailValidationToken.trim() === '') {
        setValidationError('Email validation token is required');
        setIsValidating(false);
      } else {
        setIsValidated(true);
        setIsValidating(false);
      }
    }, 1000);
  };

  const handleBillingInfoChange = (contact: any, address: any, token: string) => {
    setBillingContact(contact);
    setBillingAddress(address);
    setEmailValidationToken(token);
  };

  const handleSubmit = async () => {
    // Validate inputs
    const validationError = validatePaymentFields(billingContact, billingAddress);
    if (validationError) {
      setSquareError(validationError);
      return;
    }

    if (!emailValidationToken || !isValidated) {
      setSquareError('Email validation is required');
      return;
    }

    if (!card || !payments) {
      setSquareError('Payment form not fully loaded');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await processPaymentUpdate(
        card,
        payments,
        billingContact,
        billingAddress,
        emailValidationToken
      );
    } catch (error) {
      console.error('Payment update failed:', error);
      setIsSubmitting(false);
    }
  };

  const displayError = squareError || updateError || validationError;
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
          onBillingInfoChange={handleBillingInfoChange}
          emailValidationToken={emailValidationToken}
          onEmailValidationTokenChange={setEmailValidationToken}
          isValidated={isValidated}
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

        <EmailValidationCard
          emailValidationToken={emailValidationToken}
          onChange={setEmailValidationToken}
          emailAddress={billingContact.email || '[your email]'}
          isValidating={isValidating}
          isValidated={isValidated}
          validationError={validationError}
          onValidate={handleValidateEmail}
        />
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
          disabled={isProcessing || !card || !isInitialized || !emailValidationToken || !isValidated}
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
