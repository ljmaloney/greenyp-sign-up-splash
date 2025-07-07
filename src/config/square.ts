
// Square configuration
export const SQUARE_CONFIG = {
  // Use sandbox for development, production for live
  environment: 'sandbox', // Change to 'production' for live payments
  applicationId: process.env.SQUARE_APPLICATION_ID || 'sandbox-sq0idb-YOUR_SANDBOX_APP_ID', // Replace with your actual Square Application ID
  locationId: process.env.SQUARE_LOCATION_ID || 'YOUR_LOCATION_ID', // Replace with your actual Square Location ID
};

// Square Web SDK instance
let payments: any = null;

export const initializeSquare = async () => {
  if (!window.Square) {
    throw new Error('Square Web SDK not loaded');
  }

  if (!payments) {
    payments = window.Square.payments(SQUARE_CONFIG.applicationId, SQUARE_CONFIG.locationId);
  }

  return payments;
};

export const getSquarePayments = () => payments;
