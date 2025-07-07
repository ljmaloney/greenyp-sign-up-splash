
declare global {
  interface Window {
    Square: {
      payments: (applicationId: string, locationId: string) => {
        card: () => Promise<{
          attach: (selector: string) => Promise<void>;
          tokenize: (options?: {
            billingContact?: {
              givenName?: string;
              familyName?: string;
              email?: string;
              phone?: string;
              addressLines?: string[];
              city?: string;
              state?: string;
              postalCode?: string;
              country?: string;
            };
          }) => Promise<{
            status: string;
            token?: string;
            details?: {
              card: {
                brand: string;
                last4: string;
                expMonth: number;
                expYear: number;
              };
            };
            errors?: Array<{
              type: string;
              field?: string;
              detail: string;
            }>;
          }>;
        }>;
      };
    };
  }
}

export {};
