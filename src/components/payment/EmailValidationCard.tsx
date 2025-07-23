
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailValidationCardProps {
  email: string;
  onEmailValidated: (token: string) => void;
  isValidated: boolean;
  validationToken: string;
}

const EmailValidationCard = ({ 
  email, 
  onEmailValidated, 
  isValidated, 
  validationToken 
}: EmailValidationCardProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleValidateEmail = async () => {
    if (!email || email.trim() === '') {
      toast({
        title: "Email Required",
        description: "Please enter an email address to validate.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      // Simulate email validation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock validation token
      const token = `VAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      onEmailValidated(token);
      
      toast({
        title: "Email Validated",
        description: "Your email has been successfully validated.",
      });
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Failed to validate email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email Address</label>
          <Input 
            type="email" 
            value={email} 
            readOnly 
            className="mt-1 bg-gray-50"
          />
        </div>

        {isValidated ? (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div className="text-green-700 text-sm">
              Email validated successfully
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <div className="text-amber-700 text-sm">
              Email validation required before payment
            </div>
          </div>
        )}

        <Button
          onClick={handleValidateEmail}
          disabled={isValidating || isValidated || !email}
          className="w-full"
        >
          {isValidating ? 'Validating...' : isValidated ? 'Email Validated' : 'Validate Email'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailValidationCard;
