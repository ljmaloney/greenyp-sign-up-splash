
// Square configuration
export const SQUARE_CONFIG = {
  // Use sandbox for development, production for live
  environment: 'sandbox', // Change to 'production' for live payments
  applicationId: import.meta.env.VITE_SQUARE_APPLICATION_ID || '',
  locationId: import.meta.env.VITE_SQUARE_LOCATION_ID || '',
};

// Square Web SDK instance
let payments: any = null;
let isSquareScriptLoaded = false;

// Helper function to load Square script
const loadSquareScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Square || isSquareScriptLoaded) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sandbox.web.squarecdn.com/v1/square.js'; // Use production URL for live
    script.async = true;
    
    script.onload = () => {
      console.log('Square script loaded successfully');
      isSquareScriptLoaded = true;
      resolve();
    };
    
    script.onerror = () => {
      console.error('Failed to load Square Web SDK');
      reject(new Error('Failed to load Square Web SDK'));
    };
    
    document.head.appendChild(script);
  });
};

export const initializeSquare = async () => {
  console.log('Initializing Square with config:', SQUARE_CONFIG);
  
  // Check if we have valid Square credentials
  const hasValidCredentials = SQUARE_CONFIG.applicationId && 
                             SQUARE_CONFIG.locationId && 
                             !SQUARE_CONFIG.applicationId.includes('YOUR_') && 
                             !SQUARE_CONFIG.locationId.includes('YOUR_');

  console.log('Has valid Square credentials:', hasValidCredentials);

  // If no valid credentials, return mock for development
  if (!hasValidCredentials) {
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
      console.warn('⚠️ Square: No valid credentials found. Using development mock. Set VITE_SQUARE_APPLICATION_ID and VITE_SQUARE_LOCATION_ID environment variables for real Square integration.');
      
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
            console.log('Mock tokenization with options:', JSON.stringify(options, null, 2));
            
            // Validate the structure matches Square API requirements
            if (!options.verificationDetails || 
                !options.verificationDetails.intent ||
                typeof options.verificationDetails.customerInitiated !== 'boolean' ||
                typeof options.verificationDetails.sellerKeyedIn !== 'boolean') {
              console.error('Mock tokenization failed - invalid structure');
              return {
                status: 'ERROR',
                errors: [{
                  type: 'INVALID_REQUEST_ERROR',
                  code: 'INVALID_REQUEST_ERROR',
                  detail: 'Missing or invalid verificationDetails structure'
                }]
              };
            }
            
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
    } else {
      throw new Error('Square credentials are required for production. Please configure VITE_SQUARE_APPLICATION_ID and VITE_SQUARE_LOCATION_ID.');
    }
  }

  // Load Square script if not already loaded
  try {
    await loadSquareScript();
  } catch (error) {
    console.error('Failed to load Square script:', error);
    throw error;
  }

  // Initialize Square payments
  if (!window.Square) {
    throw new Error('Square Web SDK not available after loading script');
  }

  if (!payments) {
    try {
      console.log('Creating Square payments instance...');
      payments = window.Square.payments(SQUARE_CONFIG.applicationId, SQUARE_CONFIG.locationId);
      console.log('Square payments instance created successfully');
    } catch (error) {
      console.error('Failed to create Square payments instance:', error);
      throw new Error(`Failed to initialize Square payments: ${error.message}`);
    }
  }

  return payments;
};

export const getSquarePayments = () => payments;
