
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface EmailValidationCardProps {
  validationToken: string;
  onChange: (value: string) => void;
  emailAddress?: string;
  helperText?: string;
  isValidating?: boolean;
  isValidated?: boolean;
  validationError?: string;
  onValidate?: () => void | Promise<void>;
}

const EmailValidationCard = ({
  validationToken,
  onChange,
  emailAddress,
  helperText,
  isValidating = false,
  isValidated = false,
  validationError = '',
  onValidate
}: EmailValidationCardProps) => {
  const handleValidate = () => {
    console.log('🔍 EmailValidationCard - Verify button pressed with token:', validationToken);
    console.log('🔍 EmailValidationCard - Token length:', validationToken?.length);
    console.log('🔍 EmailValidationCard - Token value being passed:', validationToken);
    
    if (onValidate) {
      onValidate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-greenyp-600" />
          Email Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {emailAddress && (
          <div className="text-sm text-gray-600">
            Verifying: <span className="font-medium">{emailAddress}</span>
          </div>
        )}
        
        {helperText && (
          <p className="text-sm text-gray-600">{helperText}</p>
        )}

        <div className="space-y-2">
          <Label htmlFor="emailValidationToken">Verification Code</Label>
          <div className="flex gap-2">
            <Input
              id="emailValidationToken"
              name="emailValidationToken"
              type="text"
              placeholder="Enter validation code"
              value={validationToken}
              onChange={(e) => {
                console.log('🔍 EmailValidationCard - Input changed to:', e.target.value);
                onChange(e.target.value);
              }}
              disabled={isValidating || isValidated}
              className={isValidated ? 'bg-green-50 border-green-200' : ''}
            />
            {onValidate && (
              <Button
                onClick={handleValidate}
                disabled={!validationToken.trim() || isValidating || isValidated}
                variant={isValidated ? 'outline' : 'default'}
                size="sm"
              >
                {isValidating ? 'Verifying...' : isValidated ? 'Verified' : 'Verify'}
              </Button>
            )}
          </div>
        </div>

        {isValidated && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-700 text-sm">Email verified successfully</span>
          </div>
        )}

        {validationError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-red-700 text-sm">{validationError}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailValidationCard;
