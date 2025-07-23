
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Copy } from 'lucide-react';
import { Classified } from '@/types/classifieds';

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

interface BillingInformationCardProps {
  classified: Classified;
  isEnabled: boolean;
  onBillingInfoChange: (info: any) => void;
}

const BillingInformationCard = ({ 
  classified, 
  isEnabled, 
  onBillingInfoChange 
}: BillingInformationCardProps) => {
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: ''
  });

  const handleFieldChange = (field: string, value: string) => {
    const updatedInfo = { ...billingInfo, [field]: value };
    setBillingInfo(updatedInfo);
    onBillingInfoChange(updatedInfo);
  };

  const handleCopyFromAd = () => {
    const updatedInfo = {
      firstName: '',
      lastName: '',
      address: '',
      address2: '',
      city: classified.city || '',
      state: classified.state || '',
      zipCode: classified.zipCode || '',
      phone: classified.phone || '',
      email: classified.email || ''
    };
    setBillingInfo(updatedInfo);
    onBillingInfoChange(updatedInfo);
  };

  return (
    <Card className={!isEnabled ? 'opacity-50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Billing Information
        </CardTitle>
        {!isEnabled && (
          <p className="text-sm text-gray-500">
            Complete email validation to enable billing information
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyFromAd}
            disabled={!isEnabled}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy from Ad
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={billingInfo.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              disabled={!isEnabled}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={billingInfo.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              disabled={!isEnabled}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address Line 1</Label>
          <Input
            id="address"
            value={billingInfo.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            disabled={!isEnabled}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address2">Address Line 2 (Optional)</Label>
          <Input
            id="address2"
            value={billingInfo.address2}
            onChange={(e) => handleFieldChange('address2', e.target.value)}
            disabled={!isEnabled}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={billingInfo.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              disabled={!isEnabled}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={billingInfo.state}
              onValueChange={(value) => handleFieldChange('state', value)}
              disabled={!isEnabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={billingInfo.zipCode}
              onChange={(e) => handleFieldChange('zipCode', e.target.value)}
              disabled={!isEnabled}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={billingInfo.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              disabled={!isEnabled}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={billingInfo.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              disabled={!isEnabled}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingInformationCard;
