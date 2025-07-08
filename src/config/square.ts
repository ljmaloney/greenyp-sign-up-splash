

// Square configuration
export const SQUARE_CONFIG = {
  // Use sandbox for development, production for live
  environment: 'sandbox', // Change to 'production' for live payments
  applicationId: import.meta.env.VITE_SQUARE_APPLICATION_ID || '', // Replace with your actual Square Application ID
  locationId: import.meta.env.VITE_SQUARE_LOCATION_ID || '', // Replace with your actual Square Location ID
};

// Square Web SDK instance
let payments: any = null;

export const initializeSquare = async () => {
  if (!window.Square) {
    throw new Error('Square Web SDK not loaded');
  }

  // Validate required configuration
  if (!SQUARE_CONFIG.applicationId || !SQUARE_CONFIG.locationId) {
    throw new Error('Square Application ID and Location ID are required. Please configure your Square credentials.');
  }

  if (SQUARE_CONFIG.applicationId.includes('YOUR_') || SQUARE_CONFIG.locationId.includes('YOUR_')) {
    throw new Error('Please replace placeholder Square credentials with actual values from your Square Developer Dashboard.');
  }

  if (!payments) {
    payments = window.Square.payments(SQUARE_CONFIG.applicationId, SQUARE_CONFIG.locationId);
  }

  return payments;
};

export const getSquarePayments = () => payments;

