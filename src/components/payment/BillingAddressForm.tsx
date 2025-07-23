
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { STATE_ABBREVIATIONS } from '@/constants/usStates';

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
    <div>
      <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            placeholder="123 Main St"
            value={billingAddress.address}
            onChange={(e) => onChange('address', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="San Francisco"
              value={billingAddress.city}
              onChange={(e) => onChange('city', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Select value={billingAddress.state} onValueChange={(value) => onChange('state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATE_ABBREVIATIONS).map(([abbr, fullName]) => (
                  <SelectItem key={abbr} value={abbr}>
                    {fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            placeholder="94102"
            value={billingAddress.zipCode}
            onChange={(e) => onChange('zipCode', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BillingAddressForm;
