
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getApiUrl } from '@/config/api';
import { useCategories } from '@/hooks/useCategories';
import type { SearchResponse } from '@/types/search';

// Dummy data for testing UI - updated to match new API structure
const dummyResults: SearchResponse = {
  producerSearchResults: [
    {
      producerId: '1',
      producerLocationId: '1',
      businessName: 'Green Thumb Landscaping',
      phone: '(404) 555-0123',
      cellPhone: '(404) 555-0124',
      addressLine1: '123 Peachtree St',
      addressLine2: '',
      addressLine3: '',
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30309',
      websiteUrl: 'https://greenthumblandscaping.com',
      latitude: '33.7490',
      longitude: '-84.3880',
      distance: 2.5,
      businessNarrative: 'We are a full-service landscaping company specializing in sustainable garden design, lawn maintenance, and eco-friendly landscaping solutions. Our team of certified professionals brings over 20 years of experience to every project, ensuring beautiful and environmentally responsible outdoor spaces.',
      iconLink: 'https://via.placeholder.com/32x32/22c55e/ffffff?text=GT'
    },
    {
      producerId: '2',
      producerLocationId: '2',
      businessName: 'Atlanta Garden Center',
      phone: '(404) 555-0456',
      cellPhone: '',
      addressLine1: '456 Buckhead Ave',
      addressLine2: 'Suite 200',
      addressLine3: '',
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30305',
      websiteUrl: 'https://atlantagardencenter.com',
      latitude: '33.8484',
      longitude: '-84.3781',
      distance: 5.8,
      businessNarrative: 'Your premier destination for plants, garden supplies, and expert horticultural advice. We offer a wide selection of native plants, specialty tools, and organic fertilizers to help you create the garden of your dreams.',
      iconLink: ''
    },
    {
      producerId: '3',
      producerLocationId: '3',
      businessName: 'Southern Lawn Care',
      phone: '(404) 555-0789',
      cellPhone: '(770) 555-0790',
      addressLine1: '789 Midtown Blvd',
      addressLine2: '',
      addressLine3: 'Building C',
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30308',
      websiteUrl: '',
      latitude: '33.7701',
      longitude: '-84.3870',
      distance: 3.2,
      businessNarrative: 'Professional lawn care services including mowing, fertilization, pest control, and seasonal cleanup. We serve residential and commercial properties throughout the Atlanta metro area with reliable, affordable service.',
      iconLink: 'https://via.placeholder.com/32x32/16a34a/ffffff?text=SL'
    },
    {
      producerId: '4',
      producerLocationId: '4',
      businessName: 'Eco-Friendly Gardens LLC',
      phone: '(678) 555-0101',
      cellPhone: '',
      addressLine1: '321 Virginia Highland',
      addressLine2: '',
      addressLine3: '',
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30306',
      websiteUrl: 'https://ecofriendlygardens.net',
      latitude: '33.7775',
      longitude: '-84.3533',
      distance: 4.7,
      businessNarrative: 'Committed to creating beautiful outdoor spaces using sustainable practices and native plant species. Our designs focus on water conservation, wildlife habitat creation, and low-maintenance gardening solutions.',
      iconLink: ''
    },
    {
      producerId: '5',
      producerLocationId: '5',
      businessName: 'Premier Tree Services',
      phone: '(770) 555-0202',
      cellPhone: '(770) 555-0203',
      addressLine1: '654 Decatur St',
      addressLine2: 'Unit 15',
      addressLine3: '',
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30312',
      websiteUrl: 'https://premiertreeservices.com',
      latitude: '33.7376',
      longitude: '-84.3963',
      distance: 6.1,
      businessNarrative: 'Expert tree care services including pruning, removal, emergency storm cleanup, and tree health assessments. Our certified arborists ensure the safety and beauty of your trees with professional, insured service.',
      iconLink: 'https://via.placeholder.com/32x32/059669/ffffff?text=PT'
    },
    {
      producerId: '6',
      producerLocationId: '6',
      businessName: 'Urban Oasis Landscaping',
      phone: '(404) 555-0303',
      cellPhone: '',
      addressLine1: '987 Inman Park Dr',
      addressLine2: '',
      addressLine3: '',
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30307',
      websiteUrl: '',
      latitude: '33.7566',
      longitude: '-84.3532',
      distance: 4.3,
      businessNarrative: 'Transforming urban spaces into beautiful, functional outdoor environments. We specialize in small space gardens, rooftop installations, and creative landscaping solutions for city properties.',
      iconLink: ''
    }
  ],
  totalCount: 42,
  currentPage: 1,
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
        const searchQuery = new URLSearchParams({
          zipCode,
          distance,
          page: (page - 1).toString(), // Convert to 0-based indexing
          limit: '15',
          ...(categoryId && { categoryId }), // Use categoryId instead of category
          ...(searchText && { searchText }),
        });

        console.log('Fetching search results from API...');
        const searchUrl = getApiUrl(`/search?${searchQuery.toString()}`);
        console.log('Search URL:', searchUrl);

        const response = await fetch(searchUrl);
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.status} ${response.statusText}`);
        }

        const data: SearchResponse = await response.json();
        console.log('Search results received:', data);
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
