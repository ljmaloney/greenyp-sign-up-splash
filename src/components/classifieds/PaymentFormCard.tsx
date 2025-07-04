
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

interface PaymentFormCardProps {
  paymentForm: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PaymentFormCard = ({ paymentForm, onInputChange }: PaymentFormCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="w-5 h-5 mr-2 text-greenyp-600" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card Number *</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={paymentForm.cardNumber}
            onChange={(e) => onInputChange('cardNumber', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              value={paymentForm.expiryDate}
              onChange={(e) => onInputChange('expiryDate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV *</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={paymentForm.cvv}
              onChange={(e) => onInputChange('cvv', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cardholderName">Cardholder Name *</Label>
          <Input
            id="cardholderName"
            placeholder="John Doe"
            value={paymentForm.cardholderName}
            onChange={(e) => onInputChange('cardholderName', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentFormCard;
