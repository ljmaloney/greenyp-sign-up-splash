
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard as CreditCardIcon, AlertCircle } from 'lucide-react';

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
  const handlePayment = async () => {
    try {
      console.log('💳 Processing payment with Square...');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        token: `mock_token_${Date.now()}`,
        details: {
          card: {
            brand: 'VISA',
            last4: '1234',
            expMonth: 12,
            expYear: 2025
          }
        },
        billingContact,
        billingAddress
      };
      
      console.log('✅ Payment processed successfully');
      onPaymentSuccess(mockResult);
    } catch (err) {
      console.error('❌ Payment failed:', err);
      onPaymentError(err instanceof Error ? err.message : 'Payment processing failed');
    }
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
          <div className="border border-gray-300 rounded-lg p-4 min-h-[120px] bg-gray-50 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <CreditCardIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Square Payment Form</p>
              <p className="text-sm text-gray-500">Mock implementation for demo</p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          <Button
            onClick={handlePayment}
            className="w-full"
            disabled={disabled || isProcessing}
          >
            {isProcessing ? 'Processing...' : buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReactSquareCard;
