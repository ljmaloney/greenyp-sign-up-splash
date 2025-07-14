
export interface RecentClassifiedResponse {
  classifiedId: string;
  activeDate: string;
  lastActiveDate: string;
  adTypeId: string;
  categoryId: string;
  categoryName: string;
  price: number;
  perUnitType: string;
  title: string;
  description: string;
  city: string;
  state: string;
  postalCode: string;
  emailAddress: string;
  phoneNumber: string;
  obscureContactInfo: boolean;
  imageName: string | null;
  url: string | null;
  longitude: number;
  latitude: number;
  distance: number | null;
}

export interface ClassifiedSearchResponse {
  responseList: RecentClassifiedResponse[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface ApiResponse {
  response: RecentClassifiedResponse[] | null;
  errorMessageApi: any | null;
}
