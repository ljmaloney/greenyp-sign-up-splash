
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { US_STATES_AND_TERRITORIES } from '@/constants/usStates';

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
        <CardTitle className="text-center">Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-4">
            The address you provide below helps determine your location so that listings can be sorted by distance from potential buyers.
            <span className="font-bold"> Only the city, state, and ZIP code will be visible in your ad</span> — your street address will remain private.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address" className="block mb-2">Address *</Label>
              <Input
                id="address"
                value={address || ''}
                onChange={(e) => onFieldChange('address', e.target.value)}
                placeholder="Enter street address"
                required
              />
            </div>

            <div>
              <Label htmlFor="city" className="block mb-2">City *</Label>
              <Input
                id="city"
                value={city || ''}
                onChange={(e) => onFieldChange('city', e.target.value)}
                placeholder="Enter city"
                required
              />
            </div>

            <div>
              <Label htmlFor="state" className="block mb-2">State *</Label>
              <Select value={state || ''} onValueChange={(value) => onFieldChange('state', value)}>
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
              <Label htmlFor="zipCode" className="block mb-2">Zip Code *</Label>
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
