
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { US_STATES_AND_TERRITORIES } from '@/constants/usStates';

interface AdLocationFormCardProps {
  formData: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  onFieldChange: (field: string, value: string) => void;
}

const AdLocationFormCard = ({ formData, onFieldChange }: AdLocationFormCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter the Ad Location</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          The address you provide below helps determine your location so that listings can be sorted by distance from potential buyers. <strong>Only the city, state, and ZIP code will be visible in your ad</strong> — your street address will remain private.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onFieldChange('address', e.target.value)}
              placeholder="Enter street address"
              required
            />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onFieldChange('city', e.target.value)}
              placeholder="Enter city"
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Select value={formData.state} onValueChange={(value) => onFieldChange('state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50 max-h-96">
                {US_STATES_AND_TERRITORIES.map((stateName) => (
                  <SelectItem key={stateName} value={stateName}>
                    {stateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="zipCode">Zip Code *</Label>
            <Input
              id="zipCode"
              value={formData.postalCode}
              onChange={(e) => onFieldChange('postalCode', e.target.value)}
              placeholder="Enter zip code"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdLocationFormCard;
