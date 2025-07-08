
// Square configuration
export const SQUARE_CONFIG = {
  // Use sandbox for development, production for live
  environment: 'sandbox', // Change to 'production' for live payments
  applicationId: import.meta.env.VITE_SQUARE_APPLICATION_ID || 'sandbox-sq0idb-test', // Fallback for development
  locationId: import.meta.env.VITE_SQUARE_LOCATION_ID || 'sandbox-location-test', // Fallback for development
};

// Square Web SDK instance
let payments: any = null;

export const initializeSquare = async () => {
  if (!window.Square) {
    throw new Error('Square Web SDK not loaded');
  }

  // Check if we're in development mode without proper credentials
  const isDevelopment = import.meta.env.DEV;
  const hasRealCredentials = SQUARE_CONFIG.applicationId !== 'sandbox-sq0idb-test' && 
                            SQUARE_CONFIG.locationId !== 'sandbox-location-test' &&
                            !SQUARE_CONFIG.applicationId.includes('YOUR_') && 
                            !SQUARE_CONFIG.locationId.includes('YOUR_');

  if (isDevelopment && !hasRealCredentials) {
    console.warn('⚠️ Square: Using development fallback credentials. Set VITE_SQUARE_APPLICATION_ID and VITE_SQUARE_LOCATION_ID environment variables for real Square integration.');
    
    // Return a mock payments object for development
    payments = {
      card: async () => ({
        attach: async (selector: string) => {
          const element = document.querySelector(selector);
          if (element) {
            element.innerHTML = `
              <div style="padding: 20px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; text-align: center;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">
                  <strong>Development Mode</strong><br>
                  Square payment form would appear here<br>
                  <small>Configure VITE_SQUARE_APPLICATION_ID and VITE_SQUARE_LOCATION_ID to enable real payments</small>
                </p>
              </div>
            `;
          }
          return Promise.resolve();
        },
        tokenize: async (options: any) => {
          // Mock successful tokenization for development
          return {
            status: 'OK',
            token: 'mock-token-' + Date.now(),
            details: {
              card: {
                brand: 'VISA',
                last4: '1234',
                expMonth: 12,
                expYear: 2025
              }
            }
          };
        },
        destroy: () => {}
      })
    };
    
    return payments;
  }

  // Validate required configuration for production
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
