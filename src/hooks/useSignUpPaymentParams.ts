
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface SignUpPaymentParams {
  producerId: string | null;
  subscriptionId: string | null;
  subscriptionDataParam: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
}

interface UseSignUpPaymentParamsReturn {
  params: SignUpPaymentParams;
  hasRequiredData: boolean;
  validationErrors: string[];
  isValidating: boolean;
}

export const useSignUpPaymentParams = (): UseSignUpPaymentParamsReturn => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const params: SignUpPaymentParams = {
    producerId: searchParams.get('producerId'),
    subscriptionId: searchParams.get('subscription'),
    subscriptionDataParam: searchParams.get('subscriptionData'),
    email: searchParams.get('email'),
    firstName: searchParams.get('firstName'),
    lastName: searchParams.get('lastName'),
    phone: searchParams.get('phone'),
    address: searchParams.get('address'),
    city: searchParams.get('city'),
    state: searchParams.get('state'),
    postalCode: searchParams.get('postalCode')
  };

  useEffect(() => {
    const validateParams = () => {
      console.log('🔍 Enhanced URL parameter validation starting...');
      
      const errors: string[] = [];
      const warnings: string[] = [];
      
      // Critical parameters (these will cause redirect if missing)
      if (!params.producerId || params.producerId.trim() === '') {
        errors.push('Producer ID is missing');
      }
      if (!params.email || params.email.trim() === '') {
        errors.push('Email is missing');
      }
      if (!params.firstName || params.firstName.trim() === '') {
        errors.push('First name is missing');
      }
      if (!params.lastName || params.lastName.trim() === '') {
        errors.push('Last name is missing');
      }
      
      // Subscription data validation with enhanced fallback logic
      const hasSubscriptionId = params.subscriptionId && params.subscriptionId.trim() !== '';
      const hasSubscriptionData = params.subscriptionDataParam && params.subscriptionDataParam.trim() !== '';
      
      if (!hasSubscriptionId && !hasSubscriptionData) {
        // This is a warning, not a critical error - we'll let the subscription processor handle it
        warnings.push('Subscription information is missing - will attempt to load from reference data');
        console.log('⚠️ No subscription data in URL - relying on reference data fallback');
      }

      // Optional parameters validation (warnings only)
      if (!params.phone) warnings.push('Phone number not provided');
      if (!params.address) warnings.push('Address not provided');
      if (!params.city) warnings.push('City not provided');
      if (!params.state) warnings.push('State not provided');
      if (!params.postalCode) warnings.push('Postal code not provided');

      console.log('📊 Enhanced validation results:', {
        params,
        criticalErrors: errors,
        warnings: warnings,
        hasSubscriptionId,
        hasSubscriptionData,
        validationPassed: errors.length === 0,
        fullUrl: window.location.href
      });

      setValidationErrors(errors);
      setIsValidating(false);

      // Only redirect on critical errors, not subscription data issues
      if (errors.length > 0) {
        console.warn('❌ Critical URL parameter validation failed, redirecting to signup:', errors);
        setTimeout(() => {
          navigate('/subscribers/signup', { replace: true });
        }, 2000); // Give user time to see the error message
      } else if (warnings.length > 0) {
        console.log('⚠️ URL parameter warnings (proceeding with fallbacks):', warnings);
      } else {
        console.log('✅ URL parameter validation passed');
      }
    };

    validateParams();
  }, [searchParams, navigate, params.producerId, params.email, params.firstName, params.lastName, params.subscriptionId, params.subscriptionDataParam]);

  const hasRequiredData = validationErrors.length === 0;

  return {
    params,
    hasRequiredData,
    validationErrors,
    isValidating
  };
};
