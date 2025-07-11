
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailValidationTokenFormProps {
  emailValidationToken: string;
  onChange: (value: string) => void;
}

const EmailValidationTokenForm = ({ emailValidationToken, onChange }: EmailValidationTokenFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Email Validation</h3>
      <div className="space-y-2">
        <Label htmlFor="emailValidationToken">Email Validation Token *</Label>
        <Input
          id="emailValidationToken"
          type="text"
          value={emailValidationToken}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter email validation token"
          required
        />
      </div>
    </div>
  );
};

export default EmailValidationTokenForm;
