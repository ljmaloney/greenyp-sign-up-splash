
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Copy } from 'lucide-react';
import { formatPhoneAsUserTypes } from '@/utils/phoneFormatting';

interface PaymentInformationCardProps {
  classified: any;
  customer: any;
  onBillingInfoChange: (contact: any, address: any, emailToken: string) => void;
  emailValidationToken: string;
  isEmailValidated: boolean;
  showPaymentButton?: boolean;
}

const PaymentInformationCard = ({
  classified,
  customer,
  onBillingInfoChange,
  emailValidationToken,
  isEmailValidated,
  showPaymentButton = false
}: PaymentInformationCardProps) => {
  const [billingContact, setBillingContact] = useState({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    email: customer?.emailAddress || '',
    phone: customer?.phoneNumber || ''
  });

  const [billingAddress, setBillingAddress] = useState({
    address: customer?.address || '',
    address2: '',
    city: customer?.city || '',
    state: customer?.state || '',
    zipCode: customer?.postalCode || ''
  });

  useEffect(() => {
    onBillingInfoChange(billingContact, billingAddress, emailValidationToken);
  }, [billingContact, billingAddress, emailValidationToken, onBillingInfoChange]);

  const handleContactChange = (field: string, value: string) => {
    let processedValue = value;
    
    // Format phone number as user types
    if (field === 'phone') {
      processedValue = formatPhoneAsUserTypes(value);
    }
    
    setBillingContact(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleAddressChange = (field: string, value: string) => {
    let processedValue = value;
    
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
    
    setBillingAddress(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleCopyFromAd = () => {
    if (!isEmailValidated) return;
    
    setBillingContact({
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.emailAddress || '',
      phone: formatPhoneAsUserTypes(customer?.phoneNumber || '')
    });

    setBillingAddress({
      address: customer?.address || '',
      address2: '',
      city: customer?.city || '',
      state: customer?.state || '',
      zipCode: customer?.postalCode || ''
    });
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
            <User className="h-5 w-5" />
            Billing Information
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyFromAd}
            disabled={!isEmailValidated}
            className="text-xs"
            title={!isEmailValidated ? "Email must be validated before copying from ad" : "Copy information from classified ad"}
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy from Ad
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* LINE ONE: First Name, Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={billingContact.firstName}
              onChange={(e) => handleContactChange('firstName', e.target.value)}
              placeholder="John"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={billingContact.lastName}
              onChange={(e) => handleContactChange('lastName', e.target.value)}
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
            value={billingAddress.address}
            onChange={(e) => handleAddressChange('address', e.target.value)}
            placeholder="123 Main St"
            required
          />
        </div>

        {/* LINE THREE: Address Line 2 */}
        <div>
          <Label htmlFor="address2">Address Line 2</Label>
          <Input
            id="address2"
            value={billingAddress.address2}
            onChange={(e) => handleAddressChange('address2', e.target.value)}
            placeholder="Apt 4B, Suite 100, etc. (optional)"
          />
        </div>

        {/* LINE FOUR: City */}
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={billingAddress.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            placeholder="New York"
            required
          />
        </div>

        {/* LINE FIVE: State (Dropdown), Zip Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="state">State</Label>
            <Select value={billingAddress.state} onValueChange={(value) => handleAddressChange('state', value)}>
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
              value={billingAddress.zipCode}
              onChange={(e) => handleAddressChange('zipCode', e.target.value)}
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
            value={billingContact.phone}
            onChange={(e) => handleContactChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            required
          />
        </div>

        {/* LINE SEVEN: Email Address */}
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={billingContact.email}
            onChange={(e) => handleContactChange('email', e.target.value)}
            placeholder="john@example.com"
            required
            disabled
          />
        </div>

        {/* Optional Payment Button - only shown if explicitly requested */}
        {showPaymentButton && (
          <div className="pt-4 border-t">
            <Button
              className="w-full"
              disabled={!isEmailValidated}
            >
              Process Payment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentInformationCard;
