export interface SearchResult {
    producerId: string;
    businessName: string;
    phone: string;
    address: string;
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