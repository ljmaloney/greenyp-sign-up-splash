
import React from 'react';
import { SquarePaymentsForm, CreditCard } from 'react-square-web-payments-sdk';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard as CreditCardIcon, AlertCircle } from 'lucide-react';
import { getSquareConfig } from '@/utils/squareConfig';
import { useSquareForm } from '@/hooks/useSquareForm';

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
  buttonText = 'Process Payment',
  error
}: ReactSquareCardProps) => {
  const { cardTokenizeResponseReceived, isProcessing: formProcessing } = useSquareForm({
    billingContact,
    billingAddress,
    onPaymentSuccess,
    onPaymentError
  });

  const squareConfig = getSquareConfig();
  const processing = isProcessing || formProcessing;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SquarePaymentsForm
          applicationId={squareConfig.applicationId}
          locationId={squareConfig.locationId}
          cardTokenizeResponseReceived={cardTokenizeResponseReceived}
          createPaymentRequest={() => ({
            countryCode: 'US',
            currencyCode: 'USD',
            total: {
              amount: '1.00',
              label: 'Payment',
            },
          })}
        >
          <div className="space-y-4">
            <CreditCard
              style={{
                input: {
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  color: '#374151',
                  '::placeholder': {
                    color: '#9CA3AF',
                  },
                },
                '.input-container': {
                  borderColor: '#E5E7EB',
                  borderRadius: '6px',
                  borderWidth: '1px',
                  backgroundColor: '#FFFFFF',
                  padding: '12px',
                },
                '.input-container.is-focus': {
                  borderColor: '#3B82F6',
                  boxShadow: '0 0 0 1px #3B82F6',
                },
                '.input-container.is-error': {
                  borderColor: '#EF4444',
                },
                '.message-text': {
                  color: '#EF4444',
                  fontSize: '14px',
                  marginTop: '4px',
                },
              }}
            />

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={disabled || processing}
            >
              {processing ? 'Processing...' : buttonText}
            </Button>
          </div>
        </SquarePaymentsForm>
      </CardContent>
    </Card>
  );
};

export default ReactSquareCard;
