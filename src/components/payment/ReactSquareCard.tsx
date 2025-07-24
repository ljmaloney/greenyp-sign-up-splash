
import React from 'react';
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard as CreditCardIcon, AlertCircle } from 'lucide-react';
import { getSquareConfig } from '@/utils/squareConfig';

interface BillingContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BillingAddressData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ReactSquareCardProps {
  billingContact: BillingContactData;
  billingAddress: BillingAddressData;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
  isProcessing?: boolean;
  disabled?: boolean;
  buttonText?: string;
  error?: string | null;
}

const ReactSquareCard = ({
  billingContact,
  billingAddress,
  onPaymentSuccess,
  onPaymentError,
  isProcessing = false,
  disabled = false,
  buttonText = 'Pay',
  error
}: ReactSquareCardProps) => {
  const squareConfig = getSquareConfig();

  const handleCardTokenization = async (token: any, verifiedBuyer: any) => {
    try {
      console.log('💳 Card tokenization successful:', token);
      console.log('🔐 3DS verification data:', verifiedBuyer);
      console.log('💳 Full token object:', JSON.stringify(token, null, 2));
      console.log('🔐 Full verifiedBuyer object:', JSON.stringify(verifiedBuyer, null, 2));
      
      // Ensure we have the payment token
      if (!token.token) {
        console.error('💳 CRITICAL ERROR: No payment token found');
        throw new Error('Payment token not found in Square response');
      }
      
      // Extract the 3DS verification token from verifiedBuyer
      const verificationToken = verifiedBuyer?.token || null;
      
      console.log('🔐 3DS verification token:', {
        hasVerificationToken: !!verificationToken,
        verificationTokenLength: verificationToken?.length,
        verificationTokenStart: verificationToken?.substring(0, 10) + '...'
      });
      
      const result = {
        token: token.token,  // This is the payment token
        verificationToken: verificationToken,  // This is the 3DS verification token
        details: {
          card: {
            brand: token.details?.card?.brand || 'UNKNOWN',
            last4: token.details?.card?.last4 || '0000',
            expMonth: token.details?.card?.expMonth || 12,
            expYear: token.details?.card?.expYear || 2025
          }
        },
        billingContact,
        billingAddress
      };
      
      console.log('💳 Final result object:', {
        hasPaymentToken: !!result.token,
        paymentTokenLength: result.token?.length,
        paymentTokenStart: result.token?.substring(0, 10) + '...',
        hasVerificationToken: !!result.verificationToken,
        verificationTokenLength: result.verificationToken?.length,
        verificationTokenStart: result.verificationToken?.substring(0, 10) + '...',
        cardBrand: result.details.card.brand,
        cardLast4: result.details.card.last4
      });
      
      onPaymentSuccess(result);
    } catch (err) {
      console.error('❌ Card tokenization failed:', err);
      onPaymentError(err instanceof Error ? err.message : 'Card tokenization failed');
    }
  };

  const handleCardTokenizationError = (errors: any) => {
    console.error('❌ Card tokenization error:', errors);
    const errorMessage = errors?.[0]?.message || 'Card tokenization failed';
    onPaymentError(errorMessage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <PaymentForm
            applicationId={squareConfig.applicationId}
            locationId={squareConfig.locationId}
            cardTokenizeResponseReceived={handleCardTokenization}
            createPaymentRequest={() => ({
              countryCode: 'US',
              currencyCode: 'USD',
              total: {
                amount: '1.00',
                label: 'Total',
              },
            })}
          >
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg p-4 min-h-[120px]">
                <CreditCard
                  includeInputLabels={true}
                  style={{
                    input: {
                      fontSize: '16px',
                      fontFamily: 'inherit',
                    },
                    'input.is-error': {
                      color: '#dc2626',
                    },
                    '.message-text': {
                      color: '#dc2626',
                    },
                  }}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-red-700 text-sm">{error}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={disabled || isProcessing}
                className="w-full bg-greenyp-600 hover:bg-greenyp-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : buttonText}
              </button>
            </div>
          </PaymentForm>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReactSquareCard;
