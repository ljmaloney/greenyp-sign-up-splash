
export interface ClassifiedCreationResponse {
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
}

export interface ClassifiedCreationApiResponse {
  response: ClassifiedCreationResponse;
  errorMessageApi: any | null;
}
