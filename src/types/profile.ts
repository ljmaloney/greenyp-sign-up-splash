
export interface LocationHours {
  locationHoursId: string;
  createDate: string;
  lastUpdateDate: string;
  producerId: string;
  producerLocationId: string;
  dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
  openTime: string;
  closeTime: string;
}

export interface ProducerProfile {
  locationId: string;
  producerId: string;
  createDate: string;
  lastUpdateDate: string;
  subscriptionIds: string[];
  businessName: string;
  locationName: string;
  locationType: string;
  locationDisplayType: string;
  hasImagesUploaded: boolean;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  cellPhone: string;
  latitude: string;
  longitude: string;
  emailAddress: string;
  websiteUrl: string;
  businessNarrative: string;
  iconLink: string;
  locationHours: LocationHours[];
}

export interface ProducerProfileResponse {
  response: ProducerProfile;
  errorMessageApi: {
    errorCode: string;
    displayMessage: string;
    errorDetails: string;
  } | null;
}

// Legacy types for backward compatibility
export interface SubscriberProfile {
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
  subscriptionId?: string;
  subscriptionIds?: string[];
  locationId?: string;
}

// Type alias for ProfileData to match component expectations
export type ProfileData = SubscriberProfile;

export interface ProfileResponse {
  response: SubscriberProfile;
  errorMessageApi: string | null;
}

// Product types
export interface Product {
  productId: string;
  createDate: string;
  lastUpdateDate: string;
  producerId: string;
  producerLocationId: string;
  productType: "BAGGED_MATERIAL" | "BOTANICAL" | "BULK_MATERIAL" | "CONTAINERS" | "DECORATIVE_STONE" | "HARDWARE" | "LANDSCAPE_PRODUCTS" | "LANDSCAPE_TOOLS" | "POND_MAINTENANCE";
  botanicalGroup: string;
  name: string;
  price: number;
  availableQuantity: number;
  containerSize: string;
  description: string;
  discontinued: boolean;
  discontinueDate: string;
  lastOrderDate: string;
  attributes: Record<string, any>;
}

export interface ProductsResponse {
  response: Product[];
  errorMessageApi: {
    errorCode: string;
    displayMessage: string;
    errorDetails: string;
  } | null;
}

// Service types
export interface ProducerService {
  producerServiceId: string;
  createDate: string;
  lastUpdateDate: string;
  producerId: string;
  producerLocationId: string;
  minServicePrice: number;
  maxServicePrice: number;
  priceUnitsType: "LOT_SIZE" | "PER_HOUR" | "PER_MILE" | "PER_VISIT" | "FIXED_ESTIMATE";
  shortDescription: string;
  description: string;
  serviceTerms: string;
}

export interface ServicesResponse {
  response: ProducerService[];
  errorMessageApi: {
    errorCode: string;
    displayMessage: string;
    errorDetails: string;
  } | null;
}
