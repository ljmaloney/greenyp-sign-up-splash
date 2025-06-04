
export interface SearchResult {
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
    latitude: number;
    longitude: number;
    distance: number;
    businessNarrative?: string;
    iconLink?: string;
}

export interface SearchResponse {
    results: SearchResult[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

export interface SearchParams {
    zipCode: string;
    distance: string;
    category?: string;
    searchText?: string;
    page?: number;
    limit?: number;
}
