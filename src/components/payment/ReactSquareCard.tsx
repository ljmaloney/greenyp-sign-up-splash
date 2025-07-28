import React from 'react';
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import { getSquareConfig } from '@/utils/squareConfig';

interface ReactSquareCardProps {
  billingContact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  onPaymentSuccess: (tokenData: any) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  buttonText: string;
  disabled?: boolean;
  error?: string | null;
  paymentType?: 'SUBSCRIPTION' | 'CLASSIFIED' | 'PAYMENT_UPDATE';
}

const ReactSquareCard: React.FC<ReactSquareCardProps> = ({
  billingContact,
  billingAddress,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  buttonText,
  disabled,
  error,
  paymentType
}) => {
  const squareConfig = getSquareConfig();

  const handleCardTokenization = async (result: any, verifiedBuyer?: any) => {
    if (result.status === 'OK') {
      const tokenData = {
        token: result.token,
        verificationToken: verifiedBuyer?.token || '',
        details: result.details,
        billingContact,
        billingAddress
      };
      onPaymentSuccess(tokenData);
    } else {
      const errorMessage = result.errors?.[0]?.detail || 'Payment processing failed';
      onPaymentError(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      <PaymentForm
        applicationId={squareConfig.applicationId}
        locationId={squareConfig.locationId}
        cardTokenizeResponseReceived={handleCardTokenization}
        createVerificationDetails={() => ({
          billingContact: {
            givenName: billingContact.firstName,
            familyName: billingContact.lastName,
            addressLines: [billingAddress.address],
            locality: billingAddress.city,
            administrativeDistrictLevel1: billingAddress.state,
            postalCode: billingAddress.zipCode,
            email: billingContact.email,
            phone: billingContact.phone,
          },
          billingAddress: {
            addressLines: [billingAddress.address],
            locality: billingAddress.city,
            administrativeDistrictLevel1: billingAddress.state,
            postalCode: billingAddress.zipCode,
          },
          amount: '1.00',
          currencyCode: 'USD',
          intent: paymentType === 'SUBSCRIPTION' ? 'STORE' : 'CHARGE',
        })}
      >
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
      </PaymentForm>

      {error && (
        <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default ReactSquareCard;