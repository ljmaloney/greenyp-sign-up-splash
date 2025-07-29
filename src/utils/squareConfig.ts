
interface SquareConfig {
  applicationId: string;
  locationId: string;
  environment: 'sandbox' | 'production';
}

export const getSquareConfig = (): SquareConfig => {
  const applicationId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

  // For development, provide default sandbox values if environment variables are not set
  const defaultConfig = {
    applicationId: applicationId || 'sandbox-sq0idb-your-application-id',
    locationId: locationId || 'main',
    environment: 'sandbox' as const
  };

  if (!applicationId || !locationId) {
    console.warn('⚠️ Square configuration missing from environment variables. Using default sandbox config for development.');
    console.warn('💡 To use real Square payments, set VITE_SQUARE_APPLICATION_ID and VITE_SQUARE_LOCATION_ID');
    return defaultConfig;
  }

  return {
    applicationId,
    locationId,
    environment: applicationId.startsWith('sandbox') ? 'sandbox' : 'production'
  };
};
