
import { useState, useCallback } from 'react';
import { validateEmailToken } from '@/services/emailValidationService';

interface UseEmailValidationProps {
  emailAddress: string;
  context: string;
  classifiedId?: string;
  producerId?: string;
}

export const useEmailValidation = ({ emailAddress, context, classifiedId, producerId }: UseEmailValidationProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const validateEmail = useCallback(async (emailValidationToken: string) => {
    console.log('🔍 EMAIL VALIDATION HOOK - validateEmail called with token:', emailValidationToken);
    console.log('🔍 EMAIL VALIDATION HOOK - Token length:', emailValidationToken?.length);
    console.log('🔍 EMAIL VALIDATION HOOK - Full token value:', emailValidationToken);

    // EXPLICITLY copy emailValidationToken to token variable
    const token = emailValidationToken;
    
    console.log('🔍 EMAIL VALIDATION HOOK - Token copied to payload token field:', token);
    console.log('🔍 EMAIL VALIDATION HOOK - Token field length:', token?.length);
    console.log('🔍 EMAIL VALIDATION HOOK - Token field value:', token);

    const trimmedToken = token?.trim();
    if (!trimmedToken) {
      setValidationError('Validation token is required');
      console.log('❌ EMAIL VALIDATION HOOK - Token is empty after trim');
      return;
    }

    const trimmedEmail = emailAddress?.trim();
    if (!trimmedEmail) {
      setValidationError('Email address is required');
      console.log('❌ EMAIL VALIDATION HOOK - Email address is missing or empty');
      return;
    }

    if (context === 'classifieds' && !classifiedId) {
      setValidationError('Classified ID is required for validation');
      console.log('❌ EMAIL VALIDATION HOOK - Classified ID is missing');
      return;
    }

    if (context === 'subscribers' && !producerId) {
      setValidationError('Producer ID is required for validation');
      console.log('❌ EMAIL VALIDATION HOOK - Producer ID is missing');
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      console.log('✉️ EMAIL VALIDATION HOOK - Calling validateEmailToken with:', { 
        token: trimmedToken, // This is the token from emailValidationToken input
        emailAddress: trimmedEmail, 
        context, 
        classifiedId, 
        producerId
      });
      
      const result = await validateEmailToken({
        token: trimmedToken, // EXPLICITLY using the token from emailValidationToken input
        emailAddress: trimmedEmail,
        context: context as 'classifieds' | 'subscribers',
        classifiedId,
        producerId
      });

      console.log('📨 EMAIL VALIDATION HOOK - API result:', result);

      if (result.success) {
        setIsValidated(true);
        console.log('✅ EMAIL VALIDATION HOOK - Email validation successful');
      } else {
        setValidationError(result.error || 'Email validation failed');
        console.error('❌ EMAIL VALIDATION HOOK - Email validation failed:', result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email validation failed';
      setValidationError(errorMessage);
      console.error('❌ EMAIL VALIDATION HOOK - Email validation error:', errorMessage);
    } finally {
      setIsValidating(false);
    }
  }, [emailAddress, context, classifiedId, producerId]);

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
