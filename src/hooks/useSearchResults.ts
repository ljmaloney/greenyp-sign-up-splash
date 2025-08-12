
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { SearchService } from '@/services/searchService';
import type { SearchResponse, SearchResult } from '@/types/search';
import { RecordType } from '@/types/search';

// Dummy data for testing UI - updated to match v2 API structure
const dummyResults: SearchResponse = {
  pageableResults: [
    {
      externId: 'location-1',
      producerId: '1',
      locationId: 'location-1',
      categoryRef: '6ea15820-5d6d-49d7-82ab-93c23c37f637',
      categoryName: 'Landscaper',
      recordType: RecordType.GREEN_PRO,
      active: true,
      lastActiveDate: null,
      keywords: 'landscaping, garden design, lawn maintenance, sustainable gardening',
      title: 'Green Thumb Landscaping',
      businessName: 'Green Thumb Landscaping',
      businessUrl: 'https://greenthumblandscaping.com',
      businessIconUrl: null,
      imageUrl: null,
      addressLine1: '123 Peachtree St',
      addressLine2: null,
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30309',
      emailAddress: 'info@greenthumblandscaping.com',
      phoneNumber: '(404) 555-0123',
      minPrice: null,
      maxPrice: null,
      priceUnitsType: null,
      longitude: -84.3880,
      latitude: 33.7490,
      distance: 2.5,
      description: 'We are a full-service landscaping company specializing in sustainable garden design, lawn maintenance, and eco-friendly landscaping solutions.'
    },
    {
      externId: 'location-2',
      producerId: '2',
      locationId: 'location-2',
      categoryRef: '6b3afbf9-e575-419b-8539-e983ecf6c8ab',
      categoryName: 'Nurseries',
      recordType: RecordType.GREEN_PRO,
      active: true,
      lastActiveDate: null,
      keywords: 'plants, garden supplies, native plants, organic fertilizers',
      title: 'Atlanta Garden Center',
      businessName: 'Atlanta Garden Center',
      businessUrl: 'https://atlantagardencenter.com',
      businessIconUrl: null,
      imageUrl: null,
      addressLine1: '456 Buckhead Ave',
      addressLine2: 'Suite 200',
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30305',
      emailAddress: 'info@atlantagardencenter.com',
      phoneNumber: '(404) 555-0456',
      minPrice: null,
      maxPrice: null,
      priceUnitsType: null,
      longitude: -84.3781,
      latitude: 33.8484,
      distance: 5.8,
      description: 'Your premier destination for plants, garden supplies, and expert horticultural advice.'
    },
    {
      externId: 'service-1',
      producerId: '3',
      locationId: 'location-3',
      categoryRef: 'c891d114-7603-40aa-be8d-e55a23d0d1ff',
      categoryName: 'Lawn Care',
      recordType: RecordType.GREEN_PRO_SERVICE,
      active: true,
      lastActiveDate: null,
      keywords: 'lawn mowing, fertilization, pest control, seasonal cleanup',
      title: 'Weekly Lawn Maintenance',
      businessName: 'Southern Lawn Care',
      businessUrl: null,
      businessIconUrl: null,
      imageUrl: null,
      addressLine1: '789 Midtown Blvd',
      addressLine2: null,
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30308',
      emailAddress: null,
      phoneNumber: '(404) 555-0789',
      minPrice: 50,
      maxPrice: 100,
      priceUnitsType: 'PER_VISIT',
      longitude: -84.3870,
      latitude: 33.7701,
      distance: 3.2,
      description: 'Professional weekly lawn maintenance including mowing, edging, and cleanup.'
    },
    {
      externId: 'product-1',
      producerId: '4',
      locationId: 'location-4',
      categoryRef: '250f0927-f063-4707-b015-3a1a9c549115',
      categoryName: 'Garden Center',
      recordType: RecordType.GREEN_PRO_PRODUCT,
      active: true,
      lastActiveDate: null,
      keywords: 'organic fertilizer, plant food, soil amendment',
      title: 'Organic Plant Food - 25 lb bag',
      businessName: 'Eco-Friendly Gardens LLC',
      businessUrl: 'https://ecofriendlygardens.net',
      businessIconUrl: null,
      imageUrl: null,
      addressLine1: '321 Virginia Highland',
      addressLine2: null,
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30306',
      emailAddress: 'orders@ecofriendlygardens.net',
      phoneNumber: '(678) 555-0101',
      minPrice: 24.95,
      maxPrice: null,
      priceUnitsType: 'Each',
      longitude: -84.3533,
      latitude: 33.7775,
      distance: 4.7,
      description: 'Premium organic plant food made from sustainable ingredients.'
    },
    {
      externId: 'classified-1',
      producerId: null,
      locationId: null,
      categoryRef: '8185f13e-c3f1-4988-946d-01aae8329f17',
      categoryName: 'Lawn & Garden Equipment',
      recordType: RecordType.CLASSIFIED,
      active: true,
      lastActiveDate: '2025-08-10',
      keywords: 'used lawn mower, riding mower, garden equipment',
      title: 'Used Riding Mower - Excellent Condition',
      businessName: null,
      businessUrl: null,
      businessIconUrl: null,
      imageUrl: null,
      addressLine1: null,
      addressLine2: null,
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30312',
      emailAddress: 'seller@example.com',
      phoneNumber: '(770) 555-0202',
      minPrice: 1250.00,
      maxPrice: null,
      priceUnitsType: 'Each',
      longitude: -84.3963,
      latitude: 33.7376,
      distance: 6.1,
      description: 'Well-maintained riding mower, perfect for large lawns. Runs great, new blades.'
    }
  ],
  totalCount: 42,
  currentPage: 0,
  totalPages: 3
};

export const useSearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [expandedNarratives, setExpandedNarratives] = useState<Set<string>>(new Set());
  const [isApiSuccess, setIsApiSuccess] = useState(false);

  const zipCode = searchParams.get('zipCode') || '';
  const distance = searchParams.get('distance') || '25';
  const category = searchParams.get('category') || '';
  const searchText = searchParams.get('searchText') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const { data: categories } = useCategories();

  // Find the selected category name and ID
  const selectedCategory = categories?.find(cat => cat.lineOfBusinessId === category);
  const categoryName = selectedCategory?.lineOfBusinessName || '';
  const categoryId = selectedCategory?.lineOfBusinessId || '';

  // Helper function to toggle narrative expansion
  const toggleNarrative = (resultId: string) => {
    const newExpanded = new Set(expandedNarratives);
    if (newExpanded.has(resultId)) {
      newExpanded.delete(resultId);
    } else {
      newExpanded.add(resultId);
    }
    setExpandedNarratives(newExpanded);
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      setIsApiSuccess(false);

      try {
        // Build search parameters using SearchService
        const searchParams = new URLSearchParams();
        searchParams.set('zipCode', zipCode);
        searchParams.set('distance', distance);
        searchParams.set('page', page.toString());
        if (categoryId) searchParams.set('category', categoryId);
        if (searchText) searchParams.set('searchText', searchText);
        
        const params = SearchService.buildSearchParams(searchParams, categories);
        
        console.log('🔍 HOOK - Fetching search results with SearchService...');
        const data = await SearchService.search(params);
        
        setResults(data);
        setIsApiSuccess(true);
      } catch (err) {
        console.error('Error fetching search results:', err);
        console.log('Using dummy data for UI testing');
        // Use dummy data when API fails
        setResults(dummyResults);
        setError(null); // Clear error to show dummy data
        setIsApiSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (zipCode) {
      fetchResults();
    }
  }, [zipCode, distance, categoryId, searchText, page]); // Use categoryId instead of category

  return {
    results,
    loading,
    error,
    showSearchForm,
    setShowSearchForm,
    expandedNarratives,
    toggleNarrative,
    isApiSuccess,
    categoryName,
    distance,
    zipCode,
    searchText,
    page
  };
};
