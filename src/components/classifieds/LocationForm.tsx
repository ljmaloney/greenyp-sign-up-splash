
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
        <CardTitle>Location Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-4">
            The address information provided is used to determine location for sorting purposes and is shown on the website to help buyers find your item or service.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address || ''}
                onChange={(e) => onFieldChange('address', e.target.value)}
                placeholder="Enter street address"
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city || ''}
                onChange={(e) => onFieldChange('city', e.target.value)}
                placeholder="Enter city"
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={state || ''}
                onChange={(e) => onFieldChange('state', e.target.value)}
                placeholder="Enter state"
              />
            </div>

            <div>
              <Label htmlFor="zipCode">Zip Code *</Label>
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
