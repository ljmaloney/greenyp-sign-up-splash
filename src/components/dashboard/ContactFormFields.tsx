
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContactFormData, Location } from "@/types/contact";
import { normalizePhoneNumber } from "@/utils/phoneUtils";

interface ContactFormFieldsProps {
  formData: ContactFormData;
  locations: Location[];
  onFieldChange: (field: keyof ContactFormData, value: string) => void;
  isDashboardEdit?: boolean;
}

const ContactFormFields = ({ formData, locations, onFieldChange, isDashboardEdit = false }: ContactFormFieldsProps) => {
  const isGenericNameRequired = formData.displayContactType === 'GENERIC_NAME_PHONE_EMAIL';
  const hasGenericName = formData.genericContactName.trim().length > 0;
  const isFirstLastNameRequired = !isGenericNameRequired && !hasGenericName;

  const handlePhoneChange = (field: 'phoneNumber' | 'cellPhoneNumber', value: string) => {
    const normalized = normalizePhoneNumber(value);
    onFieldChange(field, normalized);
  };

  const contactTypeOptions = isDashboardEdit ? [
    { value: "PRIMARY", label: "Primary contact information for display" },
    { value: "ADMIN", label: "Primary administrative contact for the business, never displayed in search results" }
  ] : [
    { value: "PRIMARY", label: "Primary contact information for display" },
    { value: "ACCOUNTS_PAYABLE", label: "Contact for accounts payable" },
    { value: "ADMIN", label: "Primary administrative contact for the business, never displayed in search results" },
    { value: "DISABLED", label: "Contact has been disabled" },
    { value: "SALES", label: "Sales contact information for display" }
  ];

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
            {contactTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
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
          Generic Contact Name {isGenericNameRequired && '*'}
        </label>
        <Input
          value={formData.genericContactName}
          onChange={(e) => onFieldChange('genericContactName', e.target.value)}
          placeholder="e.g., Customer Service"
          required={isGenericNameRequired}
        />
        <p className="text-xs text-gray-500 mt-1">
          {isGenericNameRequired 
            ? "Required when Display Type is 'Generic name, phone, and email'" 
            : "Only A-Z, a-z, space, and & characters allowed"
          }
        </p>
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
        <p className="text-xs text-gray-500 mt-1">
          At least one contact method required (phone, cell phone, or email)
        </p>
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
          Email Address
        </label>
        <Input
          type="email"
          value={formData.emailAddress}
          onChange={(e) => onFieldChange('emailAddress', e.target.value)}
          placeholder="contact@business.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional - but at least one contact method is required
        </p>
      </div>
    </div>
  );
};

export default ContactFormFields;
