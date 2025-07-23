
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useSquarePayment } from '@/hooks/useSquarePayment';
import { useSquareForm } from '@/hooks/useSquareForm';
import { useApiClient } from '@/hooks/useApiClient';

interface SquarePaymentCardProps {
  classifiedId: string;
  emailValidationToken: string;
  billingInfo: any;
  isEnabled: boolean;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

const SquarePaymentCard = ({
  classifiedId,
  emailValidationToken,
  billingInfo,
  isEnabled,
  onPaymentSuccess,
  onPaymentError,
  onCancel
}: SquarePaymentCardProps) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const apiClient = useApiClient();
  
  const { isLoading, error, isReady, retryInitialization } = useSquarePayment();

  const handlePaymentSuccess = async (tokenData: any) => {
    setIsProcessingPayment(true);
    
    try {
      console.log('💳 Processing classified payment...', {
        classifiedId,
        emailValidationToken,
        billingInfo,
        tokenData
      });

      const payload = {
        referenceId: classifiedId,
        paymentToken: tokenData.token,
        verificationToken: tokenData.verificationToken,
        emailValidationToken,
        billingFirstName: billingInfo.firstName,
        billingLastName: billingInfo.lastName,
        billingAddress: billingInfo.address,
        billingAddress2: billingInfo.address2,
        billingCity: billingInfo.city,
        billingState: billingInfo.state,
        billingZipCode: billingInfo.zipCode,
        billingPhone: billingInfo.phone,
        billingEmail: billingInfo.email,
        producerPayment: null
      };

      const response = await apiClient.post('/classified/payment', payload, { requireAuth: false });
      
      console.log('✅ Payment successful:', response);
      onPaymentSuccess(response);
    } catch (error) {
      console.error('❌ Payment failed:', error);
      onPaymentError(error instanceof Error ? error.message : 'Payment processing failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const { cardTokenizeResponseReceived, isProcessing } = useSquareForm({
    billingContact: {
      firstName: billingInfo.firstName,
      lastName: billingInfo.lastName,
      email: billingInfo.email,
      phone: billingInfo.phone
    },
    billingAddress: {
      address: billingInfo.address,
      city: billingInfo.city,
      state: billingInfo.state,
      zipCode: billingInfo.zipCode
    },
    onPaymentSuccess: handlePaymentSuccess,
    onPaymentError
  });

  if (!isEnabled) {
    return (
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
          <p className="text-sm text-gray-500">
            Complete email validation and billing information to enable payment
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            Payment form will be available after completing the previous steps
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Initializing payment system...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={retryInitialization} variant="outline">
              Retry Initialization
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div id="card-container" className="min-h-[200px] border rounded p-4">
          {isReady ? (
            <div className="text-center text-gray-500">
              Square payment form will appear here
            </div>
          ) : (
            <div className="text-center text-gray-400">
              Loading payment form...
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing || isProcessingPayment}
            className="flex-1"
          >
            Cancel
          </Button>
          
          <Button
            onClick={() => cardTokenizeResponseReceived({ token: 'mock_token' })}
            disabled={isProcessing || isProcessingPayment || !isReady}
            className="flex-1"
          >
            {isProcessing || isProcessingPayment ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Process Payment'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SquarePaymentCard;
