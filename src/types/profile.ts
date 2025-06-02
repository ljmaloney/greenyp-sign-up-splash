
export interface LocationHours {
  dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
  openTime: string;
  closeTime: string;
}

export interface ProfileData {
  producerId: string;
  businessName: string;
  narrative: string;
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
  contactName: string;
  phoneNumber: string;
  cellPhoneNumber: string;
  locationHours: LocationHours[];
}

export interface ProfileResponse {
  response: ProfileData;
  errorMessageApi: string | null;
}
