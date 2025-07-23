
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { validateEmailToken } from '@/services/emailValidationService';

interface EmailValidationCardProps {
  classifiedId: string;
  emailAddress: string;
  onValidationSuccess: (token: string) => void;
}

const EmailValidationCard = ({ 
  classifiedId, 
  emailAddress, 
  onValidationSuccess 
}: EmailValidationCardProps) => {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [error, setError] = useState('');

  const handleValidate = async () => {
    if (!token.trim()) {
      setError('Please enter a validation token');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const result = await validateEmailToken({
        token: token.trim(),
        emailAddress,
        context: 'classifieds',
        classifiedId
      });

      if (result.success) {
        setIsValidated(true);
        onValidationSuccess(token.trim());
      } else {
        setError(result.error || 'Validation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  if (isValidated) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Email Validated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-600 text-sm">
            Email validation successful for {emailAddress}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Validation Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Please enter the validation token sent to <strong>{emailAddress}</strong> to verify your email address.
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="validation-token">Validation Token</Label>
          <Input
            id="validation-token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter 6-digit token"
            disabled={isValidating}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <Button 
          onClick={handleValidate}
          disabled={isValidating || !token.trim()}
          className="w-full"
        >
          {isValidating ? 'Validating...' : 'Validate Email'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailValidationCard;
