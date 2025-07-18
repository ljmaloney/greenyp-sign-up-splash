
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface EmailValidationCardProps {
  emailValidationToken: string;
  onChange: (value: string) => void;
  emailAddress?: string;
  helperText?: string;
  isValidating?: boolean;
  isValidated?: boolean;
  validationError?: string | null;
  onValidate?: () => void;
}

const EmailValidationCard = ({ 
  emailValidationToken, 
  onChange, 
  emailAddress = '[insert email]',
  helperText = 'A verified email address is required',
  isValidating = false,
  isValidated = false,
  validationError = null,
  onValidate
}: EmailValidationCardProps) => {
  const getValidationStatus = () => {
    if (isValidated) {
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        text: 'Email validated successfully',
        className: 'text-green-600'
      };
    }
    if (validationError) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        text: validationError,
        className: 'text-red-600'
      };
    }
    return null;
  };

  const validationStatus = getValidationStatus();

  return (
    <Card className={isValidated ? 'border-green-200 bg-green-50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Email Validation
          {validationStatus && validationStatus.icon}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 italic">
          {helperText}. We've sent a verification code to {emailAddress}.
          Please check your email and enter the code below.
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emailValidationToken">Email Validation Token *</Label>
          <div className="flex gap-2">
            <Input
              id="emailValidationToken"
              type="text"
              value={emailValidationToken}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter email validation token"
              required
              disabled={isValidated}
              aria-describedby={validationStatus ? "validation-status" : undefined}
              autoComplete="off"
              data-form-type="other"
              data-lpignore="true"
            />
            <Button
              type="button"
              onClick={onValidate}
              disabled={isValidating || isValidated || !emailValidationToken.trim()}
              className="whitespace-nowrap"
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Validating...
                </>
              ) : isValidated ? (
                'Validated'
              ) : (
                'Validate Email'
              )}
            </Button>
          </div>
        </div>

        {validationStatus && (
          <div 
            id="validation-status" 
            className={`text-sm flex items-center gap-2 ${validationStatus.className}`}
            role="status"
            aria-live="polite"
          >
            {validationStatus.icon}
            {validationStatus.text}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailValidationCard;
