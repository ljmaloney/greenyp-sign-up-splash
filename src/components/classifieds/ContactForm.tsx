
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hasContactObfuscation: boolean;
  onFieldChange: (field: string, value: string) => void;
}

const ContactForm = ({ 
  firstName,
  lastName,
  email, 
  phone, 
  hasContactObfuscation, 
  onFieldChange 
}: ContactFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Contact Information</CardTitle>
        {hasContactObfuscation && (
          <p className="text-sm text-green-600 text-center">Your contact details will be partially hidden for privacy</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => onFieldChange('firstName', e.target.value)}
              placeholder="Enter first name"
              required
            />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => onFieldChange('lastName', e.target.value)}
              placeholder="Enter last name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
