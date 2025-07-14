
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailValidationCardProps {
  emailValidationToken: string;
  onChange: (value: string) => void;
  emailAddress?: string;
  helperText?: string;
}

const EmailValidationCard = ({ 
  emailValidationToken, 
  onChange, 
  emailAddress = '[insert email]',
  helperText = 'A verified email address is required'
}: EmailValidationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Validation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600 italic">
          {helperText}. We've sent a verification code to {emailAddress}.
          Please check your email and enter the code below.
        </div>
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
      </CardContent>
    </Card>
  );
};

export default EmailValidationCard;
