
export interface SquareCardData {
  token: string;
  details: {
    card: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    };
  };
}

export interface BillingContact {
  givenName: string;
  familyName: string;
  email: string;
  phone: string;
}

export interface TokenizationRequest {
  billingContact: BillingContact;
  verificationDetails?: {
    billingContact: BillingContact;
    intent: 'CHARGE';
    customerInitiated: boolean;
    sellerKeyedIn: boolean;
  };
}

export interface SquareTokenizationResult {
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
    code?: string;
  }>;
}
