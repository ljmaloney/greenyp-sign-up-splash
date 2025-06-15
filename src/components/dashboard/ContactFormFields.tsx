
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContactFormData, Location } from "@/types/contact";
import { normalizePhoneNumber } from "@/utils/phoneUtils";

interface ContactFormFieldsProps {
  formData: ContactFormData;
  locations: Location[];
  onFieldChange: (field: keyof ContactFormData, value: string) => void;
}

const ContactFormFields = ({ formData, locations, onFieldChange }: ContactFormFieldsProps) => {
  const hasGenericName = formData.genericContactName.trim().length > 0;
  const isFirstLastNameRequired = !hasGenericName;

  const handlePhoneChange = (field: 'phoneNumber' | 'cellPhoneNumber', value: string) => {
    const normalized = normalizePhoneNumber(value);
    onFieldChange(field, normalized);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <Select value={formData.producerLocationId} onValueChange={(value) => onFieldChange('producerLocationId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.locationName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Type
        </label>
        <Select value={formData.producerContactType} onValueChange={(value: "PRIMARY" | "ACCOUNTS_PAYABLE" | "ADMIN" | "DISABLED" | "SALES") => onFieldChange('producerContactType', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRIMARY">Primary contact information for display</SelectItem>
            <SelectItem value="ACCOUNTS_PAYABLE">Contact for accounts payable</SelectItem>
            <SelectItem value="ADMIN">Primary administrative contact for the business, never displayed in search results</SelectItem>
            <SelectItem value="DISABLED">Contact has been disabled</SelectItem>
            <SelectItem value="SALES">Sales contact information for display</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Type
        </label>
        <Select value={formData.displayContactType} onValueChange={(value: "NO_DISPLAY" | "FULL_NAME_PHONE_EMAIL" | "GENERIC_NAME_PHONE_EMAIL" | "PHONE_EMAIL_ONLY") => onFieldChange('displayContactType', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NO_DISPLAY">Do not display contact in search results</SelectItem>
            <SelectItem value="FULL_NAME_PHONE_EMAIL">Display all details in search results</SelectItem>
            <SelectItem value="GENERIC_NAME_PHONE_EMAIL">Display only generic name, phone, and email in search results</SelectItem>
            <SelectItem value="PHONE_EMAIL_ONLY">Display only the phone and email in the search results</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Generic Contact Name
        </label>
        <Input
          value={formData.genericContactName}
          onChange={(e) => onFieldChange('genericContactName', e.target.value)}
          placeholder="e.g., Customer Service"
        />
        <p className="text-xs text-gray-500 mt-1">Only A-Z, a-z, space, and & characters allowed</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First Name {isFirstLastNameRequired && '*'}
        </label>
        <Input
          value={formData.firstName}
          onChange={(e) => onFieldChange('firstName', e.target.value)}
          required={isFirstLastNameRequired}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last Name {isFirstLastNameRequired && '*'}
        </label>
        <Input
          value={formData.lastName}
          onChange={(e) => onFieldChange('lastName', e.target.value)}
          required={isFirstLastNameRequired}
        />
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <Input
          value={formData.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
          placeholder="e.g., Manager, Sales Representative"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <Input
          value={formData.phoneNumber}
          onChange={(e) => handlePhoneChange('phoneNumber', e.target.value)}
          placeholder="(555) 123-4567"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cell Phone Number
        </label>
        <Input
          value={formData.cellPhoneNumber}
          onChange={(e) => handlePhoneChange('cellPhoneNumber', e.target.value)}
          placeholder="(555) 123-4567"
        />
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <Input
          type="email"
          value={formData.emailAddress}
          onChange={(e) => onFieldChange('emailAddress', e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default ContactFormFields;
