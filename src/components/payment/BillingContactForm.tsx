
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Billing Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={billingContact.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              placeholder="First name"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={billingContact.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              placeholder="Last name"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={billingContact.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="email@example.com"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={billingContact.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingContactForm;
