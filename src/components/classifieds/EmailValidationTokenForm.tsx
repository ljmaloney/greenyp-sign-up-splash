
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormItem, FormControl } from '@/components/ui/form';

interface EmailValidationTokenFormProps {
  emailValidationToken: string;
  onChange: (value: string) => void;
}

const EmailValidationTokenForm = ({ emailValidationToken, onChange }: EmailValidationTokenFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Email Validation</h3>
      <FormItem>
        <Label htmlFor="emailValidationToken">Email Validation Token *</Label>
        <FormControl>
          <Input
            id="emailValidationToken"
            type="text"
            value={emailValidationToken}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter email validation token"
            required
          />
        </FormControl>
      </FormItem>
    </div>
  );
};

export default EmailValidationTokenForm;
