
interface SquareConfigValidation {
  isValid: boolean;
  error?: string;
  config?: {
    appId: string;
    locationId: string;
    environment: string;
  };
}

export const validateSquareConfig = (): SquareConfigValidation => {
  const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

  if (!appId) {
    return {
      isValid: false,
      error: 'Square Application ID is not configured'
    };
  }

  if (!locationId) {
    return {
      isValid: false,
      error: 'Square Location ID is not configured'
    };
  }

  // Basic format validation
  if (appId.length < 10) {
    return {
      isValid: false,
      error: 'Square Application ID appears to be invalid'
    };
  }

  if (locationId.length < 10) {
    return {
      isValid: false,
      error: 'Square Location ID appears to be invalid'
    };
  }

  return {
    isValid: true,
    config: {
      appId,
      locationId,
      environment: appId.startsWith('sandbox') ? 'sandbox' : 'production'
    }
  };
};

export const preloadSquareSDK = async (): Promise<boolean> => {
  try {
    console.log('🔄 Pre-loading Square Web SDK...');
    await import('@square/web-sdk');
    console.log('✅ Square Web SDK pre-loaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to pre-load Square Web SDK:', error);
    return false;
  }
};
