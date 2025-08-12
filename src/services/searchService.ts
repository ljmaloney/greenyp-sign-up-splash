import { getApiUrl } from '@/config/api';
import type { SearchResponse, SearchParams } from '@/types/search';

/**
 * Search service for v2 API integration
 * Handles all search-related API calls using the new v2/search endpoint
 */
export class SearchService {
  /**
   * Performs a search using the v2 API endpoint
   * @param params Search parameters
   * @returns Promise<SearchResponse> The search results
   */
  static async search(params: SearchParams): Promise<SearchResponse> {
    const searchQuery = new URLSearchParams();
    
    // Required parameter
    searchQuery.set('zipCode', params.zipCode);
    
    // Optional parameters
    if (params.keywords) {
      searchQuery.set('keywords', params.keywords);
    }
    
    if (params.categoryRefId) {
      searchQuery.set('categoryRefId', params.categoryRefId);
    }
    
    if (params.distance) {
      searchQuery.set('distance', params.distance);
    }
    
    if (params.page !== undefined) {
      // v2 API uses 0-based page indexing
      searchQuery.set('page', params.page.toString());
    }

    console.log('🔍 SEARCH SERVICE - Making v2 API call with params:', params);
    
    const searchUrl = getApiUrl(`/v2/search?${searchQuery.toString()}`);
    console.log('🌐 SEARCH SERVICE - URL:', searchUrl);

    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ SEARCH SERVICE - API error:', response.status, response.statusText, errorText);
      throw new Error(`Search API failed: ${response.status} ${response.statusText}`);
    }

    const data: SearchResponse = await response.json();
    
    console.log('✅ SEARCH SERVICE - Results received:', {
      totalCount: data.totalCount,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      resultCount: data.pageableResults.length
    });
    
    // Log result types for debugging
    const resultTypes = data.pageableResults.reduce((acc, result) => {
      acc[result.recordType] = (acc[result.recordType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📊 SEARCH SERVICE - Result types:', resultTypes);
    
    return data;
  }

  /**
   * Build search parameters from URL search params
   * @param searchParams URLSearchParams from react-router
   * @param categories Available categories for mapping
   * @returns SearchParams object
   */
  static buildSearchParams(searchParams: URLSearchParams, categories?: any[]): SearchParams {
    const zipCode = searchParams.get('zipCode') || '';
    const keywords = searchParams.get('searchText') || ''; // Map from old parameter name
    const categoryParam = searchParams.get('category') || '';
    const distance = searchParams.get('distance') || '25';
    const pageParam = searchParams.get('page') || '1';
    
    // Convert 1-based page to 0-based for v2 API
    const page = Math.max(0, parseInt(pageParam) - 1);
    
    // Find category ID if a category is selected
    let categoryRefId: string | undefined;
    if (categoryParam && categories) {
      const selectedCategory = categories.find(cat => cat.lineOfBusinessId === categoryParam);
      categoryRefId = selectedCategory?.lineOfBusinessId;
    }

    const params: SearchParams = {
      zipCode,
      ...(keywords && { keywords }),
      ...(categoryRefId && { categoryRefId }),
      distance,
      page
    };

    console.log('🔧 SEARCH SERVICE - Built params:', params);
    
    return params;
  }

  /**
   * Get a friendly display name for record types
   * @param recordType The record type enum value
   * @returns Display name string
   */
  static getRecordTypeDisplayName(recordType: string): string {
    switch (recordType) {
      case 'GREEN_PRO':
        return 'Professional';
      case 'GREEN_PRO_SERVICE':
        return 'Service';
      case 'GREEN_PRO_PRODUCT':
        return 'Product';
      case 'CLASSIFIED':
        return 'Classified Ad';
      default:
        return 'Other';
    }
  }

  /**
   * Format price for display
   * @param minPrice Minimum price
   * @param maxPrice Maximum price (optional)
   * @param priceUnitsType Price unit type
   * @returns Formatted price string or null
   */
  static formatPrice(minPrice: number | null, maxPrice?: number | null, priceUnitsType?: string | null): string | null {
    if (minPrice === null) return null;
    
    const minPriceStr = `$${minPrice.toFixed(2)}`;
    const unit = priceUnitsType ? ` / ${priceUnitsType}` : '';
    
    if (maxPrice && maxPrice !== minPrice) {
      const maxPriceStr = `$${maxPrice.toFixed(2)}`;
      return `${minPriceStr} - ${maxPriceStr}${unit}`;
    }
    
    return `${minPriceStr}${unit}`;
  }
}
