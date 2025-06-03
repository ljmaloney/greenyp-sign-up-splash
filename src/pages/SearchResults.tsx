
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Globe, ArrowLeft, ExternalLink, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import { useCategories } from '@/hooks/useCategories';
import { getApiUrl } from '@/config/api';
import type { SearchResult, SearchResponse } from '../types/search'

// Dummy data for testing UI
const dummyResults: SearchResponse = {
  results: [
    {
      producerId: '1',
      businessName: 'Green Thumb Landscaping',
      phone: '(404) 555-0123',
      address: '123 Peachtree St, Atlanta, GA 30309',
      websiteUrl: 'https://greenthumblandscaping.com',
      latitude: 33.7490,
      longitude: -84.3880,
      distance: 2.5,
      businessNarrative: 'We are a full-service landscaping company specializing in sustainable garden design, lawn maintenance, and eco-friendly landscaping solutions. Our team of certified professionals brings over 20 years of experience to every project, ensuring beautiful and environmentally responsible outdoor spaces.',
      iconLink: 'https://via.placeholder.com/32x32/22c55e/ffffff?text=GT'
    },
    {
      producerId: '2',
      businessName: 'Atlanta Garden Center',
      phone: '(404) 555-0456',
      address: '456 Buckhead Ave, Atlanta, GA 30305',
      websiteUrl: 'https://atlantagardencenter.com',
      latitude: 33.8484,
      longitude: -84.3781,
      distance: 5.8,
      businessNarrative: 'Your premier destination for plants, garden supplies, and expert horticultural advice. We offer a wide selection of native plants, specialty tools, and organic fertilizers to help you create the garden of your dreams.',
      iconLink: null
    },
    {
      producerId: '3',
      businessName: 'Southern Lawn Care',
      phone: '(404) 555-0789',
      address: '789 Midtown Blvd, Atlanta, GA 30308',
      websiteUrl: '',
      latitude: 33.7701,
      longitude: -84.3870,
      distance: 3.2,
      businessNarrative: 'Professional lawn care services including mowing, fertilization, pest control, and seasonal cleanup. We serve residential and commercial properties throughout the Atlanta metro area with reliable, affordable service.',
      iconLink: 'https://via.placeholder.com/32x32/16a34a/ffffff?text=SL'
    },
    {
      producerId: '4',
      businessName: 'Eco-Friendly Gardens LLC',
      phone: '(678) 555-0101',
      address: '321 Virginia Highland, Atlanta, GA 30306',
      websiteUrl: 'https://ecofriendlygardens.net',
      latitude: 33.7775,
      longitude: -84.3533,
      distance: 4.7,
      businessNarrative: 'Committed to creating beautiful outdoor spaces using sustainable practices and native plant species. Our designs focus on water conservation, wildlife habitat creation, and low-maintenance gardening solutions.',
      iconLink: null
    },
    {
      producerId: '5',
      businessName: 'Premier Tree Services',
      phone: '(770) 555-0202',
      address: '654 Decatur St, Atlanta, GA 30312',
      websiteUrl: 'https://premiertreeservices.com',
      latitude: 33.7376,
      longitude: -84.3963,
      distance: 6.1,
      businessNarrative: 'Expert tree care services including pruning, removal, emergency storm cleanup, and tree health assessments. Our certified arborists ensure the safety and beauty of your trees with professional, insured service.',
      iconLink: 'https://via.placeholder.com/32x32/059669/ffffff?text=PT'
    },
    {
      producerId: '6',
      businessName: 'Urban Oasis Landscaping',
      phone: '(404) 555-0303',
      address: '987 Inman Park Dr, Atlanta, GA 30307',
      websiteUrl: '',
      latitude: 33.7566,
      longitude: -84.3532,
      distance: 4.3,
      businessNarrative: 'Transforming urban spaces into beautiful, functional outdoor environments. We specialize in small space gardens, rooftop installations, and creative landscaping solutions for city properties.',
      iconLink: null
    }
  ],
  totalCount: 42,
  currentPage: 1,
  totalPages: 3
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [expandedNarratives, setExpandedNarratives] = useState<Set<string>>(new Set());

  const zipCode = searchParams.get('zipCode') || '';
  const distance = searchParams.get('distance') || '25';
  const category = searchParams.get('category') || '';
  const service = searchParams.get('service') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const { data: categories } = useCategories();

  // Find the selected category name
  const selectedCategory = categories?.find(cat => cat.lineOfBusinessId === category);
  const categoryName = selectedCategory?.lineOfBusinessName || '';

  const toggleNarrative = (resultId: string) => {
    const newExpanded = new Set(expandedNarratives);
    if (newExpanded.has(resultId)) {
      newExpanded.delete(resultId);
    } else {
      newExpanded.add(resultId);
    }
    setExpandedNarratives(newExpanded);
  };

  const truncateNarrative = (narrative: string, maxLength: number = 150) => {
    if (narrative.length <= maxLength) return narrative;
    return narrative.substring(0, maxLength) + '...';
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchQuery = new URLSearchParams({
          zipCode,
          distance,
          page: page.toString(),
          limit: '15',
          ...(category && { category }),
          ...(service && { service }),
        });

        const searchUrl = getApiUrl(`/search?${searchQuery.toString()}`);
        console.log('Fetching search results from API...');
        console.log('Search URL:', searchUrl);

        const response = await fetch(searchUrl);
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.status} ${response.statusText}`);
        }

        const data: SearchResponse = await response.json();
        console.log('Search results received:', data);
        setResults(data);
      } catch (err) {
        console.error('Error fetching search results:', err);
        console.log('Using dummy data for UI testing');
        // Use dummy data when API fails
        setResults(dummyResults);
        setError(null); // Clear error to show dummy data
      } finally {
        setLoading(false);
      }
    };

    if (zipCode) {
      fetchResults();
    }
  }, [zipCode, distance, category, service, page]);

  const generateMapUrl = (latitude: number, longitude: number, businessName: string) => {
    // Using Google Maps static API for small map images
    const encodedName = encodeURIComponent(businessName);
    return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=200x150&markers=color:red%7C${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`;
  };

  const createPageUrl = (pageNum: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNum.toString());
    return `/search?${newParams.toString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greenyp-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Searching for providers...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/">
              <Button className="bg-greenyp-600 hover:bg-greenyp-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow py-8 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Search Summary */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {categoryName || 'Green Industry Providers'}
                </h1>
                <p className="text-gray-600">
                  {results?.totalCount || 0} providers found within {distance} miles of {zipCode}
                </p>
              </div>
              <Button 
                onClick={() => setShowSearchForm(!showSearchForm)}
                variant="outline"
                className="border-greenyp-600 text-greenyp-600 hover:border-yellow-500 hover:text-yellow-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                New Search
              </Button>
            </div>
          </div>

          {/* Search Form - Show when button is clicked */}
          {showSearchForm && (
            <div className="mb-8">
              <SearchForm showHeading={false} />
            </div>
          )}

          {/* Results */}
          {results && results.results.length > 0 ? (
            <>
              <div className="grid gap-6 mb-8">
                {results.results.map((result) => (
                  <Card key={result.producerId} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Business Info */}
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              {result.iconLink && (
                                <img 
                                  src={result.iconLink} 
                                  alt={`${result.businessName} icon`}
                                  className="w-8 h-8 mr-3 rounded"
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              )}
                              <h3 className="text-xl font-semibold text-gray-900">
                                {result.businessName}
                              </h3>
                            </div>
                            <Link 
                              to={`/profile/${result.producerId}`}
                              className="flex items-center text-greenyp-600 hover:text-greenyp-700 text-sm font-medium"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Profile
                            </Link>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-600 flex-wrap">
                              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="mr-4">{result.address}</span>
                              {result.phone && (
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <a href={`tel:${result.phone}`} className="hover:text-greenyp-600">
                                    {result.phone}
                                  </a>
                                </div>
                              )}
                            </div>
                            
                            {result.websiteUrl && (
                              <div className="flex items-center text-gray-600">
                                <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                                <a 
                                  href={result.websiteUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:text-greenyp-600 truncate flex items-center"
                                >
                                  {result.websiteUrl}
                                  <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                                </a>
                              </div>
                            )}

                            {result.businessNarrative && (
                              <div className="text-gray-600">
                                <p className="mb-1">
                                  {expandedNarratives.has(result.producerId) 
                                    ? result.businessNarrative 
                                    : truncateNarrative(result.businessNarrative)
                                  }
                                </p>
                                {result.businessNarrative.length > 150 && (
                                  <button
                                    onClick={() => toggleNarrative(result.producerId)}
                                    className="text-greenyp-600 hover:text-greenyp-700 text-sm font-medium flex items-center"
                                  >
                                    {expandedNarratives.has(result.producerId) ? (
                                      <>
                                        <ChevronUp className="w-3 h-3 mr-1" />
                                        Show Less
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="w-3 h-3 mr-1" />
                                        Read More
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            Distance: {result.distance.toFixed(1)} miles
                          </div>
                        </div>

                        {/* Map */}
                        <div className="flex-shrink-0">
                          <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            {result.latitude && result.longitude ? (
                              <img
                                src={generateMapUrl(result.latitude, result.longitude, result.businessName)}
                                alt={`Map location for ${result.businessName}`}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  // Fallback when Google Maps API key is not available
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) {
                                    fallback.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                              <MapPin className="w-8 h-8" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {results.totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious href={createPageUrl(page - 1)} />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: Math.min(5, results.totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(results.totalPages - 4, page - 2)) + i;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink 
                            href={createPageUrl(pageNum)}
                            isActive={pageNum === page}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {page < results.totalPages && (
                      <PaginationItem>
                        <PaginationNext href={createPageUrl(page + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No providers found</h3>
              <p className="text-gray-600 mb-6">
                Try expanding your search distance or removing some filters.
              </p>
              <Link to="/">
                <Button className="bg-greenyp-600 hover:bg-greenyp-700">
                  Start New Search
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
