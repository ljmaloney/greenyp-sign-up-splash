
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPhoneAsUserTypes } from '@/utils/phoneFormatting';

interface BillingContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BillingContactFormProps {
  billingContact: BillingContactData;
  onChange: (field: string, value: string) => void;
}

const BillingContactForm = ({ billingContact, onChange }: BillingContactFormProps) => {
  const handleContactChange = (field: string, value: string) => {
    if (field === 'phone') {
      const formatted = formatPhoneAsUserTypes(value);
      onChange(field, formatted);
    } else {
      onChange(field, value);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Billing Contact</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              placeholder="John"
              value={billingContact.firstName}
              onChange={(e) => handleContactChange('firstName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={billingContact.lastName}
              onChange={(e) => handleContactChange('lastName', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={billingContact.email}
            onChange={(e) => handleContactChange('email', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1(555) 123-4567"
            value={billingContact.phone}
            onChange={(e) => handleContactChange('phone', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BillingContactForm;
