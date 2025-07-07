
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock } from 'lucide-react';

interface PaymentTotalCardProps {
  packageData: any;
  onPayment: () => void;
  hasValidPayment?: boolean;
  paymentToken?: string;
  isProcessing?: boolean;
}

const PaymentTotalCard = ({ 
  packageData, 
  onPayment, 
  hasValidPayment = false,
  paymentToken,
  isProcessing = false
}: PaymentTotalCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-gray-900">
            Total: ${packageData?.monthlyPrice || 0}/month
          </div>
          <p className="text-sm text-gray-600">
            By clicking "Complete Purchase", you agree to pay ${packageData?.monthlyPrice || 0}/month for your classified ad.
          </p>
          
          {paymentToken && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded-md">
              ✓ Payment information validated and ready
            </div>
          )}
          
          <Button 
            onClick={onPayment}
            size="lg" 
            className="bg-greenyp-600 hover:bg-greenyp-700 w-full px-8"
            disabled={!hasValidPayment || isProcessing}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isProcessing 
              ? 'Processing Payment...' 
              : `Complete Purchase - $${packageData?.monthlyPrice || 0}/month`
            }
          </Button>
          <div className="flex items-center justify-center text-xs text-gray-500 mt-2">
            <Lock className="w-3 h-3 mr-1" />
            Secure 256-bit SSL encryption
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentTotalCard;
