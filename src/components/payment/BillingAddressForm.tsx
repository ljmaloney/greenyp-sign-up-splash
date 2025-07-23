
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface BillingAddressData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface BillingAddressFormProps {
  billingAddress: BillingAddressData;
  onChange: (field: string, value: string) => void;
}

const BillingAddressForm = ({ billingAddress, onChange }: BillingAddressFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Billing Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={billingAddress.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="123 Main Street"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={billingAddress.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="City"
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={billingAddress.state}
              onChange={(e) => onChange('state', e.target.value)}
              placeholder="State"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={billingAddress.zipCode}
            onChange={(e) => onChange('zipCode', e.target.value)}
            placeholder="12345"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingAddressForm;
