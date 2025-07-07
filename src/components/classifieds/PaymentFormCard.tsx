
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Copy } from 'lucide-react';

interface PaymentFormCardProps {
  paymentForm: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    email: string;
    phoneNumber: string;
  };
  onInputChange: (field: string, value: string) => void;
  onCopyFromClassified?: () => void;
  classifiedData?: any;
}

const PaymentFormCard = ({ paymentForm, onInputChange, onCopyFromClassified, classifiedData }: PaymentFormCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Lock className="w-5 h-5 mr-2 text-greenyp-600" />
            Secure Payment
          </div>
          {onCopyFromClassified && classifiedData && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyFromClassified}
              className="text-xs"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy from Ad
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cardholderName">Cardholder Name *</Label>
          <Input
            id="cardholderName"
            placeholder="John Doe"
            value={paymentForm.cardholderName}
            onChange={(e) => onInputChange('cardholderName', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={paymentForm.email}
            onChange={(e) => onInputChange('email', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="(555) 123-4567"
            value={paymentForm.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
          />
        </div>

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
      </CardContent>
    </Card>
  );
};

export default PaymentFormCard;
