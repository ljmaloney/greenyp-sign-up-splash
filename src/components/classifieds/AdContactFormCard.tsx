
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AdContactFormCardProps {
  formData: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
  };
  onFieldChange: (field: string, value: string) => void;
}

const AdContactFormCard = ({ formData, onFieldChange }: AdContactFormCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Provide Your Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => onFieldChange('firstName', e.target.value)}
              placeholder="Enter first name"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
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
              value={formData.emailAddress}
              onChange={(e) => onFieldChange('emailAddress', e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => onFieldChange('phoneNumber', e.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdContactFormCard;
