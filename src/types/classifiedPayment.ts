
export interface ClassifiedPaymentData {
  classified: {
    classifiedId: string;
    title: string;
    description: string;
    categoryId: string;
    price: number;
    perUnitType: string;
    city: string;
    state: string;
    postalCode: string;
    createDate: string;
    adTypeId: string;
  };
  customer: {
    emailAddress: string;
    phoneNumber: string;
  };
}

export interface ClassifiedPaymentResponse {
  response: ClassifiedPaymentData;
  errorMessageApi: any | null;
}

export interface PaymentProcessResponse {
  paymentStatus: string;
  errorStatusCode?: string;
  errorDetail?: string;
  orderRef?: string;
  paymentRef?: string;
  receiptNumber?: string;
}
