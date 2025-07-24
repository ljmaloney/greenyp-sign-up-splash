
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

  const validateEmail = useCallback(async (token: string) => {
    console.log('🔍 EMAIL VALIDATION HOOK - Starting validation with params:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenValue: token, // Log the actual token to see what we're sending
      tokenTrimmed: token?.trim(),
      tokenTrimmedLength: token?.trim().length,
      hasEmailAddress: !!emailAddress,
      emailAddress: emailAddress,
      emailAddressTrimmed: emailAddress?.trim(),
      context: context,
      hasClassifiedId: !!classifiedId,
      classifiedId: classifiedId,
      hasProducerId: !!producerId,
      producerId: producerId
    });

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
      console.log('✉️ EMAIL VALIDATION HOOK - Calling email validation API with:', { 
        emailAddress: trimmedEmail, 
        context, 
        classifiedId, 
        producerId,
        token: trimmedToken.substring(0, 10) + '...',
        fullToken: trimmedToken, // Show full token for debugging
        tokenCharacterAnalysis: {
          length: trimmedToken.length,
          startsWith: trimmedToken.substring(0, 5),
          endsWith: trimmedToken.substring(trimmedToken.length - 5),
          containsSpaces: trimmedToken.includes(' '),
          containsNewlines: trimmedToken.includes('\n'),
          containsTabs: trimmedToken.includes('\t')
        }
      });
      
      const result = await validateEmailToken({
        token: trimmedToken,
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
