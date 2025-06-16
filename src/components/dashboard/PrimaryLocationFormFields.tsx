
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { US_STATES_AND_TERRITORIES } from '@/constants/usStates';

interface PrimaryLocationFormFieldsProps {
  formData: {
    locationName: string;
    locationDisplayType: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: string;
    longitude: string;
    websiteUrl: string;
  };
  onFieldChange: (field: string, value: string) => void;
}

const PrimaryLocationFormFields = ({ formData, onFieldChange }: PrimaryLocationFormFieldsProps) => {
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
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coordinates
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                value={formData.latitude}
                onChange={(e) => onFieldChange('latitude', e.target.value)}
                placeholder="Latitude (37.7749)"
              />
            </div>
            <div>
              <Input
                value={formData.longitude}
                onChange={(e) => onFieldChange('longitude', e.target.value)}
                placeholder="Longitude (-122.4194)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimaryLocationFormFields;
