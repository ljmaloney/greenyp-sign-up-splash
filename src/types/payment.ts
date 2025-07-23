
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
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface PaymentMethodResponse {
  response: PaymentMethod | null;
  errorMessageApi: any | null;
}
