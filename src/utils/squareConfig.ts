
interface SquareConfig {
  applicationId: string;
  locationId: string;
  environment: 'sandbox' | 'production';
}

export const getSquareConfig = (): SquareConfig => {
  const applicationId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

  if (!applicationId || !locationId) {
    throw new Error('Square configuration missing. Please check your environment variables.');
  }

  return {
    applicationId,
    locationId,
    environment: applicationId.startsWith('sandbox') ? 'sandbox' : 'production'
  };
};
