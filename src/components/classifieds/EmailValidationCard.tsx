
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailValidationCardProps {
  emailValidationToken: string;
  onChange: (value: string) => void;
}

const EmailValidationCard = ({ emailValidationToken, onChange }: EmailValidationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Validation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600 italic">
          An email validation token is required to ensure the authenticity of the email address provided. Please enter the token sent to your email address.
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
