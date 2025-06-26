
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationFormProps {
  address?: string;
  city?: string;
  state?: string;
  zipCode: string;
  onFieldChange: (field: string, value: string) => void;
}

const LocationForm = ({ 
  address, 
  city, 
  state, 
  zipCode, 
  onFieldChange 
}: LocationFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-4">
            The address you provide below helps determine your location so that listings can be sorted by distance from potential buyers.
            <span className="font-bold"> Only the city, state, and ZIP code will be visible in your ad</span> — your street address will remain private.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address" className="block text-left">Address</Label>
              <Input
                id="address"
                value={address || ''}
                onChange={(e) => onFieldChange('address', e.target.value)}
                placeholder="Enter street address"
              />
            </div>

            <div>
              <Label htmlFor="city" className="block text-left">City</Label>
              <Input
                id="city"
                value={city || ''}
                onChange={(e) => onFieldChange('city', e.target.value)}
                placeholder="Enter city"
              />
            </div>

            <div>
              <Label htmlFor="state" className="block text-left">State</Label>
              <Input
                id="state"
                value={state || ''}
                onChange={(e) => onFieldChange('state', e.target.value)}
                placeholder="Enter state"
              />
            </div>

            <div>
              <Label htmlFor="zipCode" className="block text-left">Zip Code *</Label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => onFieldChange('zipCode', e.target.value)}
                placeholder="Enter zip code"
                required
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationForm;
