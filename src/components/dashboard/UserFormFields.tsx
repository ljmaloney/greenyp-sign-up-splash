
import React from 'react';
import { Input } from "@/components/ui/input";

interface AuthorizedUser {
  id: string;
  firstName: string;
  lastName: string;
  businessPhone: string;
  cellPhone: string;
  emailAddress: string;
  userName: string;
}

interface UserFormFieldsProps {
  formData: AuthorizedUser;
  onFieldChange: (field: keyof AuthorizedUser, value: string) => void;
}

const UserFormFields = ({ formData, onFieldChange }: UserFormFieldsProps) => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <Input
            value={formData.firstName}
            onChange={(e) => onFieldChange('firstName', e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <Input
            value={formData.lastName}
            onChange={(e) => onFieldChange('lastName', e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Phone
          </label>
          <Input
            value={formData.businessPhone}
            onChange={(e) => onFieldChange('businessPhone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cell Phone
          </label>
          <Input
            value={formData.cellPhone}
            onChange={(e) => onFieldChange('cellPhone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>
      
      <div>
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
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username *
        </label>
        <Input
          value={formData.userName}
          onChange={(e) => onFieldChange('userName', e.target.value)}
          required
        />
      </div>
    </>
  );
};

export default UserFormFields;
