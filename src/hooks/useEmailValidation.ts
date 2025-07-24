
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
    console.log('🔍 EMAIL VALIDATION HOOK - Starting validation with params:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenValue: token, // Log the actual token to see what we're sending
      hasEmailAddress: !!emailAddress,
      emailAddress: emailAddress,
      context: context,
      hasClassifiedId: !!classifiedId,
      classifiedId: classifiedId
    });

    if (!token.trim()) {
      setValidationError('Validation token is required');
      console.log('❌ EMAIL VALIDATION HOOK - Token is empty');
      return;
    }

    if (!emailAddress) {
      setValidationError('Email address is required');
      console.log('❌ EMAIL VALIDATION HOOK - Email address is missing');
      return;
    }

    if (context === 'classifieds' && !classifiedId) {
      setValidationError('Classified ID is required for validation');
      console.log('❌ EMAIL VALIDATION HOOK - Classified ID is missing');
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      console.log('✉️ EMAIL VALIDATION HOOK - Calling email validation API with:', { 
        emailAddress, 
        context, 
        classifiedId, 
        token: token.substring(0, 10) + '...',
        fullToken: token // Show full token for debugging
      });
      
      const result = await validateEmailToken({
        token,
        emailAddress,
        context: context as 'classifieds' | 'subscribers',
        classifiedId,
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
