
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateEmailToken } from '@/services/emailValidationService';

interface UseEmailValidationProps {
  emailAddress: string;
  context: 'classifieds' | 'subscribers';
  classifiedId?: string;
  producerId?: string;
}

export const useEmailValidation = ({
  emailAddress,
  context,
  classifiedId,
  producerId
}: UseEmailValidationProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateEmail = async (token: string) => {
    if (!token.trim()) {
      setValidationError('Email validation token is required');
      toast({
        title: "Validation Required",
        description: "Please enter the email validation token",
        variant: "destructive",
      });
      return;
    }

    // For classifieds, we need classifiedId
    if (context === 'classifieds' && !classifiedId) {
      setValidationError('Missing classified ID');
      toast({
        title: "Error",
        description: "Missing classified information",
        variant: "destructive",
      });
      return;
    }

    // For subscribers, we need producerId
    if (context === 'subscribers' && !producerId) {
      setValidationError('Missing producer ID');
      toast({
        title: "Error",
        description: "Missing producer information",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const result = await validateEmailToken({
        token,
        emailAddress,
        context,
        classifiedId,
        producerId
      });

      if (result.success) {
        setIsValidated(true);
        toast({
          title: "Email Validated Successfully",
          description: "You can now proceed with payment",
        });
      } else {
        setValidationError(result.error || 'Validation failed');
        toast({
          title: "Validation Failed",
          description: result.error || 'Invalid email validation token',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Email validation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setValidationError(errorMessage);
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const resetValidation = () => {
    setIsValidated(false);
    setValidationError(null);
  };

  return {
    isValidating,
    isValidated,
    validationError,
    validateEmail,
    resetValidation
  };
};
