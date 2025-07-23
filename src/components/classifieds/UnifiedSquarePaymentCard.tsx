
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUnifiedSquarePayment } from '@/hooks/useUnifiedSquarePayment';
import SquareErrorBoundary from '@/components/payment/SquareErrorBoundary';
import { AlertTriangle, CreditCard, RefreshCw } from 'lucide-react';
import { BillingContactData, BillingAddressData } from '@/types/billing';

interface UnifiedSquarePaymentCardProps {
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  emailValidationToken: string;
  cardContainerRef: React.RefObject<HTMLDivElement>;
  payments: any;
  card: any;
  squareError: string | null;
  setSquareError: (error: string | null) => void;
  paymentType: 'classified' | 'subscription';
  producerId?: string;
}

const UnifiedSquarePaymentCard = ({ 
  billingContact, 
  billingAddress, 
  emailValidationToken,
  cardContainerRef,
  payments,
  card,
  squareError,
  setSquareError,
  paymentType,
  producerId
}: UnifiedSquarePaymentCardProps) => {
  console.log('💳 UnifiedSquarePaymentCard - Rendering with enhanced stability', {
    paymentType,
    hasCard: !!card,
    hasPayments: !!payments,
    producerId,
    squareError,
    hasEmailToken: !!emailValidationToken
  });

  const {
    isProcessing,
    error: paymentError,
    processPayment
  } = useUnifiedSquarePayment({
    billingContact,
    billingAddress,
    emailValidationToken,
    paymentType,
    producerId
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const handlePayment = useCallback(async () => {
    console.log('🎯 UnifiedSquarePaymentCard - Processing payment with validation checks');
    
    // Clear any previous local errors
    setLocalError(null);
    setSquareError(null);

    // Enhanced validation checks
    if (!card || !payments) {
      const errorMsg = 'Payment form not ready. Please wait for the form to load completely.';
      setLocalError(errorMsg);
      console.error('❌ Payment form not ready', { hasCard: !!card, hasPayments: !!payments });
      return;
    }

    if (!emailValidationToken || emailValidationToken.trim() === '') {
      const errorMsg = 'Email validation is required before processing payment.';
      setLocalError(errorMsg);
      console.error('❌ Email validation token missing');
      return;
    }

    // Validate billing information
    if (!billingContact.firstName || !billingContact.lastName || !billingContact.email) {
      const errorMsg = 'Complete billing contact information is required.';
      setLocalError(errorMsg);
      console.error('❌ Incomplete billing contact', billingContact);
      return;
    }

    if (!billingAddress.address || !billingAddress.city || !billingAddress.state || !billingAddress.zipCode) {
      const errorMsg = 'Complete billing address is required.';
      setLocalError(errorMsg);
      console.error('❌ Incomplete billing address', billingAddress);
      return;
    }

    console.log('✅ All validations passed, processing payment...');
    await processPayment(card, payments);
  }, [card, payments, processPayment, setSquareError, emailValidationToken, billingContact, billingAddress]);

  const handleRetry = () => {
    console.log('🔄 UnifiedSquarePaymentCard - Retrying payment setup');
    setLocalError(null);
    setSquareError(null);
    // The parent component should handle Square reinitialization
  };

  const displayError = localError || squareError || paymentError;
  const isCardReady = !!(card && payments && !squareError && !localError);
  const canProcessPayment = isCardReady && emailValidationToken.trim() !== '' && !isProcessing;

  return (
    <SquareErrorBoundary>
      <Card className={displayError ? 'border-red-200' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Square Card Container */}
          <div className="relative">
            <div 
              id="card-container" 
              ref={cardContainerRef}
              className="p-4 border border-gray-300 rounded-lg min-h-[120px] bg-white transition-all duration-200"
              style={{ minHeight: '120px' }}
            />
            
            {!isCardReady && !displayError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
                <div className="text-center">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                  <div className="text-sm text-gray-600">Loading payment form...</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Error Display */}
          {displayError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-red-800 font-medium">Payment Error</div>
                <div className="text-red-700 text-sm mt-1">{displayError}</div>
                {(squareError || localError) && (
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    size="sm"
                    className="mt-2 text-red-700 border-red-300 hover:bg-red-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Validation Status */}
          {!emailValidationToken && !displayError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-amber-800 text-sm">
                ⚠️ Email validation is required before you can process payment
              </div>
            </div>
          )}
          
          {/* Payment Button */}
          <Button 
            onClick={handlePayment}
            disabled={!canProcessPayment}
            className={`w-full ${
              canProcessPayment 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            size="lg"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Process Payment
              </>
            )}
          </Button>

          {/* Status Information */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>✓ Secure payment processing powered by Square</div>
            <div className={emailValidationToken ? 'text-green-600' : 'text-gray-400'}>
              {emailValidationToken ? '✓' : '○'} Email validation {emailValidationToken ? 'completed' : 'required'}
            </div>
            <div className={isCardReady ? 'text-green-600' : 'text-gray-400'}>
              {isCardReady ? '✓' : '○'} Payment form {isCardReady ? 'ready' : 'loading'}
            </div>
          </div>
        </CardContent>
      </Card>
    </SquareErrorBoundary>
  );
};

export default UnifiedSquarePaymentCard;
