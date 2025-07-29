import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Copy } from 'lucide-react';
import { formatPhoneAsUserTypes } from '@/utils/phoneFormatting';

interface BillingInformation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentInformationCardProps {
  initialBillingInfo: BillingInformation;
  onBillingInfoChange: (billingInfo: BillingInformation, emailToken: string) => void;
  emailValidationToken: string;
  isEmailValidated: boolean;
  copyFromAdData?: BillingInformation; // Optional data to copy from ad
  showCopyButton?: boolean; // Control whether to show the copy button
}

const PaymentInformationCard = ({
  initialBillingInfo,
  onBillingInfoChange,
  emailValidationToken,
  isEmailValidated,
  copyFromAdData,
  showCopyButton = true
}: PaymentInformationCardProps) => {
  const [billingInfo, setBillingInfo] = useState<BillingInformation>(initialBillingInfo);

  // Update internal state when initial values change
  useEffect(() => {
    setBillingInfo(initialBillingInfo);
  }, [initialBillingInfo]);

  useEffect(() => {
    onBillingInfoChange(billingInfo, emailValidationToken);
  }, [billingInfo, emailValidationToken, onBillingInfoChange]);

  const handleFieldChange = (field: keyof BillingInformation, value: string) => {
    let processedValue = value;
    
    // Format phone number as user types
    if (field === 'phone') {
      processedValue = formatPhoneAsUserTypes(value);
    }
    
    // Format ZIP code to acceptable formats
    if (field === 'zipCode') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 5) {
        processedValue = cleaned;
      } else if (cleaned.length <= 9) {
        processedValue = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
      } else {
        processedValue = `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}`;
      }
    }
    
    setBillingInfo(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleCopyFromAd = () => {
    if (!isEmailValidated || !copyFromAdData) return;
    
    // Copy all data from the ad data
    setBillingInfo(copyFromAdData);
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-greenyp-600" />
            Billing Information
          </div>
          {showCopyButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyFromAd}
              disabled={!isEmailValidated || !copyFromAdData}
              className="text-xs"
              title={!isEmailValidated ? "Email must be validated before copying from ad" : "Copy information from account data"}
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy from Ad
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* LINE ONE: First Name, Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={billingInfo.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              placeholder="John"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={billingInfo.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              placeholder="Doe"
              required
            />
          </div>
        </div>

        {/* LINE TWO: Address Line 1 */}
        <div>
          <Label htmlFor="address">Address Line 1</Label>
          <Input
            id="address"
            value={billingInfo.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            placeholder="123 Main St"
            required
          />
        </div>

        {/* LINE THREE: Address Line 2 */}
        <div>
          <Label htmlFor="address2">Address Line 2</Label>
          <Input
            id="address2"
            value={billingInfo.address2}
            onChange={(e) => handleFieldChange('address2', e.target.value)}
            placeholder="Apt 4B, Suite 100, etc. (optional)"
          />
        </div>

        {/* LINE FOUR: City */}
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={billingInfo.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            placeholder="New York"
            required
          />
        </div>

        {/* LINE FIVE: State (Dropdown), Zip Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="state">State</Label>
            <Select value={billingInfo.state} onValueChange={(value) => handleFieldChange('state', value)}>
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
          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={billingInfo.zipCode}
              onChange={(e) => handleFieldChange('zipCode', e.target.value)}
              placeholder="12345 or 12345-6789"
              required
            />
          </div>
        </div>

        {/* LINE SIX: Phone Number */}
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={billingInfo.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            required
          />
        </div>

        {/* LINE SEVEN: Email Address - EDITABLE */}
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={billingInfo.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="john@example.com"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This email address will be used for billing purposes only. It will not be displayed publicly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInformationCard;