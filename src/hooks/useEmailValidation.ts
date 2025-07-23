
import { useState, useCallback } from 'react';

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

    setIsValidating(true);
    setValidationError('');

    try {
      console.log('✉️ Validating email...', { emailAddress, context, classifiedId, token });
      
      // Simulate email validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 6-digit token
      if (token.length === 6 && /^\d{6}$/.test(token)) {
        setIsValidated(true);
        console.log('✅ Email validation successful');
      } else {
        throw new Error('Invalid validation token. Please enter a 6-digit code.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email validation failed';
      setValidationError(errorMessage);
      console.error('❌ Email validation failed:', errorMessage);
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
