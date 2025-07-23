
export interface PaymentMethod {
  id?: string;
  producerId: string;
  cardId?: string;
  customerId?: string;
  lastFourDigits?: string;
  last4?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  billingAddress?: {
    addressLine1?: string;
    locality?: string;
    administrativeDistrictLevel1?: string;
    postalCode?: string;
  };
  // Add missing properties for billing address
  payorAddress1?: string;
  payorAddress2?: string;
  payorCity?: string;
  payorState?: string;
  payorPostalCode?: string;
  phoneNumber?: string;
  emailAddress?: string;
  // Fixed card details structure to match actual usage
  cardDetails?: {
    cardBrand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
    cardholderName?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface PaymentMethodResponse {
  response: PaymentMethod | null;
  errorMessageApi: any | null;
}
