
import { useState, useCallback } from 'react';
import { validateEmailToken } from '@/services/emailValidationService';

interface UseEmailValidationProps {
  emailAddress: string;
  context: string;
  classifiedId?: string;
}

export const useEmailValidation = ({ emailAddress, context, classifiedId }: UseEmailValidationProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const validateEmail = useCallback(async (token: string) => {
    if (!token.trim()) {
      setValidationError('Validation token is required');
      return;
    }

    if (!emailAddress) {
      setValidationError('Email address is required');
      return;
    }

    if (context === 'classifieds' && !classifiedId) {
      setValidationError('Classified ID is required for validation');
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      console.log('✉️ Calling email validation API...', { 
        emailAddress, 
        context, 
        classifiedId, 
        token: token.substring(0, 10) + '...' 
      });
      
      const result = await validateEmailToken({
        token,
        emailAddress,
        context: context as 'classifieds' | 'subscribers',
        classifiedId,
      });

      if (result.success) {
        setIsValidated(true);
        console.log('✅ Email validation successful');
      } else {
        setValidationError(result.error || 'Email validation failed');
        console.error('❌ Email validation failed:', result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email validation failed';
      setValidationError(errorMessage);
      console.error('❌ Email validation error:', errorMessage);
    } finally {
      setIsValidating(false);
    }
  }, [emailAddress, context, classifiedId]);

  const resetValidation = useCallback(() => {
    setIsValidated(false);
    setValidationError('');
    setIsValidating(false);
  }, []);

  return {
    isValidating,
    isValidated,
    validationError,
    validateEmail,
    resetValidation
  };
};
