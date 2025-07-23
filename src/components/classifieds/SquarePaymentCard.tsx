
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Shield } from 'lucide-react';

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
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!isEnabled) return;
    
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, simulate successful payment
      onPaymentSuccess({ paymentId: 'demo_payment_' + Date.now() });
    } catch (error) {
      onPaymentError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={!isEnabled ? 'opacity-50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
        {!isEnabled && (
          <p className="text-sm text-gray-500">
            Complete email validation and billing information to enable payment
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Shield className="h-4 w-4" />
            <span>Secure Payment Processing</span>
          </div>
          <p className="text-sm text-gray-600">
            Payment information is processed securely through Square. 
            Your card details are encrypted and never stored on our servers.
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-yellow-50 p-3 rounded-lg text-sm">
            <p className="text-yellow-800">
              <strong>Demo Mode:</strong> This is a demonstration payment form. 
              No actual payment will be processed.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handlePayment}
              disabled={!isEnabled || isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processing Payment...' : 'Complete Payment'}
            </Button>
            
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SquarePaymentCard;
