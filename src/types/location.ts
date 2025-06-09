
export interface LocationFormData {
  locationId?: string;
  locationName: string;
  locationType: string;
  locationDisplayType: string;
  active: boolean;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  websiteUrl: string;
}

export interface Location {
  id: string;
  name: string;
  locationType: string;
  locationDisplayType: string;
  active: boolean;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  websiteUrl?: string;
  isPrimary: boolean;
}
