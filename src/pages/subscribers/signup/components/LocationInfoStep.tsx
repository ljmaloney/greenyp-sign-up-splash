
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignupFormData } from '../SubscriberSignUp';

interface LocationInfoStepProps {
  formData: SignupFormData;
  updateFormData: (field: keyof SignupFormData, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const LocationInfoStep = ({ formData, updateFormData, onNext, onPrev }: LocationInfoStepProps) => {
  const isValid = formData.locationName && formData.addressLine1 && formData.city && formData.state && formData.postalCode;

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Primary Location</h3>
        <p className="text-gray-600 mb-6">Provide your main business location details</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="locationName">Location Name *</Label>
          <Input
            id="locationName"
            value={formData.locationName}
            onChange={(e) => updateFormData('locationName', e.target.value)}
            placeholder="Main Office, Headquarters, etc."
            required
          />
        </div>

        <div>
          <Label htmlFor="addressLine1">Address Line 1 *</Label>
          <Input
            id="addressLine1"
            value={formData.addressLine1}
            onChange={(e) => updateFormData('addressLine1', e.target.value)}
            placeholder="Street address"
            required
          />
        </div>

        <div>
          <Label htmlFor="addressLine2">Address Line 2</Label>
          <Input
            id="addressLine2"
            value={formData.addressLine2}
            onChange={(e) => updateFormData('addressLine2', e.target.value)}
            placeholder="Apartment, suite, unit, etc."
          />
        </div>

        <div>
          <Label htmlFor="addressLine3">Address Line 3</Label>
          <Input
            id="addressLine3"
            value={formData.addressLine3}
            onChange={(e) => updateFormData('addressLine3', e.target.value)}
            placeholder="Additional address information"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              placeholder="City"
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => updateFormData('state', e.target.value)}
              placeholder="State"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => updateFormData('postalCode', e.target.value)}
            placeholder="ZIP code"
            required
          />
        </div>

        <div>
          <Label htmlFor="locationWebsiteUrl">Location Website URL</Label>
          <Input
            id="locationWebsiteUrl"
            type="url"
            value={formData.locationWebsiteUrl}
            onChange={(e) => updateFormData('locationWebsiteUrl', e.target.value)}
            placeholder="https://locationwebsite.com"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!isValid}>
          Next Step
        </Button>
      </div>
    </div>
  );
};

export default LocationInfoStep;
