
export interface CardDetails {
  id: string;
  cardBrand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  cardholderName: string;
  fingerprint: string;
  customerId: string;
  merchantId: string;
  referenceId: string;
  enabled: boolean;
  cardType: string;
  prepaidType: string;
  bin: string;
  version: number;
  issuerAlert: string;
  issuerAlertAt: string;
  hsaFsa: boolean;
  additionalProperties: {
    [key: string]: any;
  };
}

export interface PaymentMethod {
  paymentMethodId: string;
  createDate: string;
  lastUpdateDate: string;
  cancelDate: string;
  referenceId: string;
  externCustRef: string;
  statusType: "TEMP" | "ACTIVE" | "CANCELLED";
  cardRef: string;
  givenName: string;
  familyName: string;
  companyName: string;
  payorAddress1: string;
  payorAddress2: string;
  payorCity: string;
  payorState: string;
  payorPostalCode: string;
  phoneNumber: string;
  emailAddress: string;
  cardDetails: CardDetails;
}

export interface PaymentMethodResponse {
  response: PaymentMethod;
  errorMessageApi: {
    errorCode: string;
    displayMessage: string;
    errorDetails: string;
  } | null;
}
