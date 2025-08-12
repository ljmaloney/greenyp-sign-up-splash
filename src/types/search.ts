
// Record types for different search result types
export enum RecordType {
    GREEN_PRO = 'GREEN_PRO',           // Pro (subscriber) profile - externId maps to locationId
    GREEN_PRO_SERVICE = 'GREEN_PRO_SERVICE',   // Pro service - externId maps to serviceId  
    GREEN_PRO_PRODUCT = 'GREEN_PRO_PRODUCT',   // Pro product - externId maps to productId
    CLASSIFIED = 'CLASSIFIED'          // Classified ad - externId maps to classifiedId
}

// Search result item from v2 API
export interface SearchResult {
    externId: string;                  // Maps to locationId/serviceId/productId/classifiedId based on recordType
    producerId: string | null;
    locationId: string | null;
    categoryRef: string;
    categoryName: string | null;       // Used for indicator display
    recordType: RecordType;
    active: boolean;
    lastActiveDate: string | null;
    keywords: string;
    title: string;
    businessName: string | null;
    businessUrl: string | null;
    businessIconUrl: string | null;
    imageUrl: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    emailAddress: string | null;
    phoneNumber: string;
    minPrice: number | null;
    maxPrice: number | null;
    priceUnitsType: string | null;
    longitude: number;
    latitude: number;
    distance: number;
    description: string | null;
}

// v2 API Response structure
export interface SearchResponse {
    pageableResults: SearchResult[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

// Search parameters for v2 endpoint
export interface SearchParams {
    zipCode: string;
    keywords?: string;
    categoryRefId?: string;
    distance?: string;
    page?: number;
}

// Legacy interface for backward compatibility (if needed)
export interface LegacySearchResult {
    producerId: string;
    producerLocationId: string;
    businessName: string;
    phone: string;
    cellPhone: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    city: string;
    state: string;
    postalCode: string;
    websiteUrl: string;
    latitude: string;
    longitude: string;
    distance: number;
    businessNarrative?: string;
    iconLink?: string;
}
