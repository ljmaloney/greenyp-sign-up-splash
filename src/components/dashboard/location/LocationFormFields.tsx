
import React from 'react';
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { LocationFormData } from "@/types/location.ts";
import { US_STATES_AND_TERRITORIES } from "@/constants/usStates.ts";

interface LocationFormFieldsProps {
  formData: LocationFormData;
  onFieldChange: (field: keyof LocationFormData, value: string | boolean) => void;
  showActiveToggle?: boolean;
}

const LocationFormFields = ({ formData, onFieldChange, showActiveToggle = false }: LocationFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location Name *
        </label>
        <Input
          value={formData.locationName}
          onChange={(e) => onFieldChange('locationName', e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location Type
        </label>
        <Select value={formData.locationType} onValueChange={(value) => onFieldChange('locationType', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HOME_OFFICE_PRIMARY">Primary</SelectItem>
            <SelectItem value="RETAIL_SALES_SERVICE">Retail Sales & Service</SelectItem>
            <SelectItem value="WHOLESALE_SALES">Wholesale</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Type
        </label>
        <Select value={formData.locationDisplayType} onValueChange={(value) => onFieldChange('locationDisplayType', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NO_DISPLAY">Do not display this location in the search results</SelectItem>
            <SelectItem value="CITY_STATE_ZIP">Display only the city, state, and zip code in search results</SelectItem>
            <SelectItem value="FULL_ADDRESS">Display the full address in the search results</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1 *
          </label>
          <Input
            value={formData.addressLine1}
            onChange={(e) => onFieldChange('addressLine1', e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2
          </label>
          <Input
            value={formData.addressLine2}
            onChange={(e) => onFieldChange('addressLine2', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <Input
            value={formData.city}
            onChange={(e) => onFieldChange('city', e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <Select value={formData.state} onValueChange={(value) => onFieldChange('state', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES_AND_TERRITORIES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code *
          </label>
          <Input
            value={formData.postalCode}
            onChange={(e) => onFieldChange('postalCode', e.target.value)}
            pattern="^\d{5}(-\d{4})?$"
            placeholder="12345 or 12345-6789"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website URL
          </label>
          <Input
            value={formData.websiteUrl}
            onChange={(e) => onFieldChange('websiteUrl', e.target.value)}
            placeholder="https://www.example.com"
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Display Type
            </label>
            <Select value={formData.displayContactType || 'PHONE_EMAIL_ONLY'} onValueChange={(value) => onFieldChange('displayContactType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FULL_NAME_PHONE_EMAIL">Display all details in search results</SelectItem>
                <SelectItem value="GENERIC_NAME_PHONE_EMAIL">Display only generic name, phone, and email in search results</SelectItem>
                <SelectItem value="PHONE_EMAIL_ONLY">Display only the phone and email in the search results</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Generic Contact Name
              </label>
              <Input
                value={formData.genericContactName || ''}
                onChange={(e) => onFieldChange('genericContactName', e.target.value)}
                placeholder="Customer Service"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                value={formData.title || ''}
                onChange={(e) => onFieldChange('title', e.target.value)}
                placeholder="Manager"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <Input
                value={formData.firstName || ''}
                onChange={(e) => onFieldChange('firstName', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <Input
                value={formData.lastName || ''}
                onChange={(e) => onFieldChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <Input
                value={formData.phoneNumber || ''}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
                  if (value.length <= 10) {
                    // Format as (XXX) XXX-XXXX
                    if (value.length >= 6) {
                      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
                    } else if (value.length >= 3) {
                      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                    }
                    onFieldChange('phoneNumber', value);
                  }
                }}
                placeholder="(555) 123-4567"
                maxLength={14}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cell Phone Number
              </label>
              <Input
                value={formData.cellPhoneNumber || ''}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
                  if (value.length <= 10) {
                    // Format as (XXX) XXX-XXXX
                    if (value.length >= 6) {
                      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
                    } else if (value.length >= 3) {
                      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                    }
                    onFieldChange('cellPhoneNumber', value);
                  }
                }}
                placeholder="(555) 123-4567"
                maxLength={14}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <Input
              type="email"
              value={formData.emailAddress || ''}
              onChange={(e) => onFieldChange('emailAddress', e.target.value)}
              placeholder="contact@company.com"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationFormFields;
