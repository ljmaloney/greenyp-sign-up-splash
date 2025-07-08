
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SquareCardFormFieldsProps {
  billingInfo: {
    cardholderName: string;
    email: string;
    phoneNumber: string;
  };
  onInputChange: (field: string, value: string) => void;
  isProcessing: boolean;
}

const SquareCardFormFields = ({ billingInfo, onInputChange, isProcessing }: SquareCardFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cardholderName">Cardholder Name *</Label>
        <Input
          id="cardholderName"
          placeholder="John Doe"
          value={billingInfo.cardholderName}
          onChange={(e) => onInputChange('cardholderName', e.target.value)}
          disabled={isProcessing}
        />
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={billingInfo.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          disabled={isProcessing}
        />
      </div>

      <div>
        <Label htmlFor="phoneNumber">Phone Number *</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="(555) 123-4567"
          value={billingInfo.phoneNumber}
          onChange={(e) => onInputChange('phoneNumber', e.target.value)}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default SquareCardFormFields;
