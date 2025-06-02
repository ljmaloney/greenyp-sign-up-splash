
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Globe, ArrowLeft } from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';

interface SearchResult {
  id: string;
  businessName: string;
  phone: string;
  address: string;
  websiteUrl: string;
  latitude: number;
  longitude: number;
  distance: number;
}

interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const zipCode = searchParams.get('zipCode') || '';
  const distance = searchParams.get('distance') || '25';
  const category = searchParams.get('category') || '';
  const service = searchParams.get('service') || '';
  const page = parseInt(searchParams.get('page') || '1');

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

        console.log('Fetching search results from API...');
        console.log('Search URL:', `http://services.greenyp.com/search?${searchQuery.toString()}`);

        const response = await fetch(`http://services.greenyp.com/search?${searchQuery.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.status} ${response.statusText}`);
        }

        const data: SearchResponse = await response.json();
        console.log('Search results received:', data);
        setResults(data);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch search results');
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
                  Green Industry Providers
                </h1>
                <p className="text-gray-600">
                  {results?.totalCount || 0} providers found within {distance} miles of {zipCode}
                </p>
              </div>
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  New Search
                </Button>
              </Link>
            </div>
          </div>

          {/* Results */}
          {results && results.results.length > 0 ? (
            <>
              <div className="grid gap-6 mb-8">
                {results.results.map((result) => (
                  <Card key={result.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Business Info */}
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            {result.businessName}
                          </h3>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span>{result.address}</span>
                            </div>
                            
                            {result.phone && (
                              <div className="flex items-center text-gray-600">
                                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                <a href={`tel:${result.phone}`} className="hover:text-greenyp-600">
                                  {result.phone}
                                </a>
                              </div>
                            )}
                            
                            {result.websiteUrl && (
                              <div className="flex items-center text-gray-600">
                                <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                                <a 
                                  href={result.websiteUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:text-greenyp-600 truncate"
                                >
                                  {result.websiteUrl}
                                </a>
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
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling!.style.display = 'flex';
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
