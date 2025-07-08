
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface PaymentFormFieldsProps {
  paymentInfo: PaymentInfo;
  onInputChange: (field: string, value: string) => void;
}

const PaymentFormFields = ({ paymentInfo, onInputChange }: PaymentFormFieldsProps) => {
  return (
    <div className="space-y-4">
      {/* Cardholder Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            placeholder="John"
            value={paymentInfo.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={paymentInfo.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={paymentInfo.email}
          onChange={(e) => onInputChange('email', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1(555) 123-4567"
          value={paymentInfo.phone}
          onChange={(e) => onInputChange('phone', e.target.value)}
        />
      </div>
    </div>
  );
};

export default PaymentFormFields;
