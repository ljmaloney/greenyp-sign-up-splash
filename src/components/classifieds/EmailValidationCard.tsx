
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Check, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [validationCode, setValidationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const { toast } = useToast();

  const handleSendCode = async () => {
    try {
      // Simulate sending validation code
      setIsCodeSent(true);
      toast({
        title: "Validation Code Sent",
        description: `A validation code has been sent to ${emailAddress}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send validation code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleValidateCode = async () => {
    if (!validationCode.trim()) return;
    
    setIsValidating(true);
    try {
      // Simulate code validation - for demo purposes, accept any 6-digit code
      if (validationCode.length === 6) {
        const mockToken = 'validated_' + classifiedId;
        setIsValidated(true);
        onValidationSuccess(mockToken);
      } else {
        throw new Error('Invalid code');
      }
    } catch (error) {
      toast({
        title: "Invalid Code",
        description: "The validation code is incorrect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  if (isValidated) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Check className="h-5 w-5" />
            Email Validated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">
            Email address has been successfully validated. You can now proceed with billing information.
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
          Email Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            We need to validate your email address: <strong>{emailAddress}</strong>
          </p>
        </div>

        {!isCodeSent ? (
          <Button onClick={handleSendCode} className="w-full">
            Send Validation Code
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Code sent to {emailAddress}</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="validationCode">Enter 6-digit validation code</Label>
              <Input
                id="validationCode"
                value={validationCode}
                onChange={(e) => setValidationCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleValidateCode} 
                disabled={validationCode.length !== 6 || isValidating}
                className="flex-1"
              >
                {isValidating ? 'Validating...' : 'Validate Code'}
              </Button>
              <Button variant="outline" onClick={handleSendCode}>
                Resend
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailValidationCard;
