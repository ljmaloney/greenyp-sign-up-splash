
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
    if (onValidate) {
      onValidate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
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
          <Label htmlFor="validation-token">Verification Code</Label>
          <div className="flex gap-2">
            <Input
              id="validation-token"
              type="text"
              placeholder="Enter 6-digit code"
              value={validationToken}
              onChange={(e) => onChange(e.target.value)}
              maxLength={6}
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
