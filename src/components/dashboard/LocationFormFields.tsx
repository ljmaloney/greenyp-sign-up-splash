
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LocationFormData } from "@/types/location";

interface LocationFormFieldsProps {
  formData: LocationFormData;
  onFieldChange: (field: keyof LocationFormData, value: string | boolean) => void;
  showActiveToggle?: boolean;
}

const LocationFormFields = ({ formData, onFieldChange, showActiveToggle = false }: LocationFormFieldsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
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
      
      {showActiveToggle && (
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Active Location
          </label>
          <Switch
            checked={formData.active}
            onCheckedChange={(checked) => onFieldChange('active', checked)}
          />
        </div>
      )}
      
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
            <SelectItem value="NO_DISPLAY">No Display</SelectItem>
            <SelectItem value="DISPLAY_WITH_MAP">Display with Map</SelectItem>
            <SelectItem value="DISPLAY_ONLY">Display Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
          Address Line 3
        </label>
        <Input
          value={formData.addressLine3}
          onChange={(e) => onFieldChange('addressLine3', e.target.value)}
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
        <Input
          value={formData.state}
          onChange={(e) => onFieldChange('state', e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Postal Code *
        </label>
        <Input
          value={formData.postalCode}
          onChange={(e) => onFieldChange('postalCode', e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Latitude
        </label>
        <Input
          value={formData.latitude}
          onChange={(e) => onFieldChange('latitude', e.target.value)}
          placeholder="37.7749"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Longitude
        </label>
        <Input
          value={formData.longitude}
          onChange={(e) => onFieldChange('longitude', e.target.value)}
          placeholder="-122.4194"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website URL
        </label>
        <Input
          value={formData.websiteUrl}
          onChange={(e) => onFieldChange('websiteUrl', e.target.value)}
          placeholder="www.example.com"
        />
      </div>
    </div>
  );
};

export default LocationFormFields;
