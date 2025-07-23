import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy } from 'lucide-react';
import { usePaymentInformation } from '@/hooks/usePaymentInformation';
import { normalizePhoneForSquare } from '@/utils/phoneUtils';

interface ClassifiedData {
  classifiedId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  price: number;
  perUnitType: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  emailAddress: string;
}

interface PaymentInformationCardProps {
  classified: ClassifiedData;
  customer: CustomerData;
  onBillingInfoChange?: (contact: any, address: any, emailValidationToken: string) => void;
  emailValidationToken?: string;
  isEmailValidated?: boolean;
}

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

const PaymentInformationCard = ({ 
  classified, 
  customer, 
  onBillingInfoChange,
  emailValidationToken = '',
  isEmailValidated = false 
}: PaymentInformationCardProps) => {
  const {
    billingContact,
    billingAddress,
    handleCopyFromCustomer,
    handleContactChange,
    handleAddressChange
  } = usePaymentInformation({
    customer,
    onBillingInfoChange,
    emailValidationToken,
    isValidated: isEmailValidated
  });

  const handlePhoneChange = (value: string) => {
    const normalizedPhone = normalizePhoneForSquare(value);
    handleContactChange('phone', normalizedPhone);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Information</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyFromCustomer}
            disabled={!isEmailValidated}
            className="text-xs"
            title={!isEmailValidated ? "Email must be validated before copying customer information" : "Copy customer information to payment form"}
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy from Ad
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              value={billingContact.firstName}
              onChange={(e) => handleContactChange('firstName', e.target.value)}
              disabled={!isEmailValidated}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              value={billingContact.lastName}
              onChange={(e) => handleContactChange('lastName', e.target.value)}
              disabled={!isEmailValidated}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address Line 1 *</Label>
          <Input
            id="address"
            type="text"
            value={billingAddress.address}
            onChange={(e) => handleAddressChange('address', e.target.value)}
            disabled={!isEmailValidated}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address2">Address Line 2</Label>
          <Input
            id="address2"
            type="text"
            value={billingAddress.address2 || ''}
            onChange={(e) => handleAddressChange('address2', e.target.value)}
            disabled={!isEmailValidated}
            placeholder="Suite, unit, building, floor, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            type="text"
            value={billingAddress.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            disabled={!isEmailValidated}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select 
              value={billingAddress.state} 
              onValueChange={(value) => handleAddressChange('state', value)}
              disabled={!isEmailValidated}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60 z-50">
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code *</Label>
            <Input
              id="zipCode"
              type="text"
              value={billingAddress.zipCode}
              onChange={(e) => handleAddressChange('zipCode', e.target.value)}
              disabled={!isEmailValidated}
              maxLength={10}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={billingContact.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            disabled={!isEmailValidated}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={billingContact.email}
            onChange={(e) => handleContactChange('email', e.target.value)}
            disabled={!isEmailValidated}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInformationCard;
