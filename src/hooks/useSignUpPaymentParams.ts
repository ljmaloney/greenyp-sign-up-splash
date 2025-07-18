
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
      const errors: string[] = [];
      
      // Check for essential parameters
      if (!params.producerId) errors.push('Producer ID is missing');
      if (!params.email) errors.push('Email is missing');
      if (!params.firstName) errors.push('First name is missing');
      if (!params.lastName) errors.push('Last name is missing');
      
      // Check subscription data - either subscriptionId OR subscriptionDataParam should be present
      const hasSubscriptionId = params.subscriptionId && params.subscriptionId.trim() !== '';
      const hasSubscriptionData = params.subscriptionDataParam && params.subscriptionDataParam.trim() !== '';
      
      if (!hasSubscriptionId && !hasSubscriptionData) {
        errors.push('Subscription information is missing');
      }

      console.log('🔍 URL Parameter Validation:', {
        params,
        hasSubscriptionId,
        hasSubscriptionData,
        errors,
        fullUrl: window.location.href
      });

      setValidationErrors(errors);
      setIsValidating(false);

      // Redirect to signup if validation fails
      if (errors.length > 0) {
        console.warn('❌ URL parameter validation failed, redirecting to signup:', errors);
        setTimeout(() => {
          navigate('/subscribers/signup', { replace: true });
        }, 100);
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
