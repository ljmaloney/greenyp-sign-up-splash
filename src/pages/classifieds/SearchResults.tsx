import React, { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PublicHeader from '@/components/PublicHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import ClassifiedCard from '@/components/classifieds/ClassifiedCard';
import ClassifiedsSearchForm from '@/components/classifieds/ClassifiedsSearchForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInfiniteClassifieds } from '@/hooks/useInfiniteClassifieds';
import { ClassifiedFilters } from '@/types/classifieds';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filters: ClassifiedFilters = {
    category: searchParams.get('category') || undefined,
    zipCode: searchParams.get('zipCode') || undefined,
    keyword: searchParams.get('keyword') || undefined,
    maxMiles: searchParams.get('maxMiles') ? parseInt(searchParams.get('maxMiles')!) : undefined,
  };

  const {
    data: infiniteData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteClassifieds(filters);

  const classifieds = infiniteData?.pages.flatMap(page => page.data) || [];

  // Store search parameters for back navigation
  useEffect(() => {
    const searchParamsString = searchParams.toString();
    if (searchParamsString) {
      sessionStorage.setItem('lastSearchParams', searchParamsString);
    }
  }, [searchParams]);

  const handleFiltersChange = (newFilters: ClassifiedFilters) => {
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.zipCode) params.set('zipCode', newFilters.zipCode);
    if (newFilters.keyword) params.set('keyword', newFilters.keyword);
    if (newFilters.maxMiles) params.set('maxMiles', newFilters.maxMiles.toString());
    setSearchParams(params);
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      >= document.documentElement.offsetHeight - 100
    ) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const getSearchDescription = () => {
    const hasZipCode = filters.zipCode;
    const hasCategory = filters.category;
    const hasKeyword = filters.keyword;
    const hasDistance = filters.maxMiles;

    if (!hasZipCode && !hasCategory && !hasKeyword && !hasDistance) {
      return 'Showing all classifieds';
    }

    let description = 'Showing results for ';
    const parts = [];

    if (hasKeyword) {
      parts.push(`"${filters.keyword}"`);
    }

    if (hasCategory) {
      parts.push(`${hasKeyword ? 'in' : ''} ${filters.category}`);
    }

    if (hasZipCode) {
      const distanceText = hasDistance ? ` within ${filters.maxMiles} miles of` : ' near';
      parts.push(`${distanceText} ${filters.zipCode}`);
    } else if (hasDistance) {
      parts.push(`within ${filters.maxMiles} miles`);
    }

    if (parts.length === 0) {
      return 'Showing all classifieds';
    }

    return description + parts.join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Link to="/classifieds">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Classifieds
                </Button>
              </Link>
              
              <Link to="/classifieds/create">
                <Button className="bg-greenyp-600 hover:bg-greenyp-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Post my Ad
                </Button>
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
            <p className="text-gray-600">
              {getSearchDescription()}
            </p>
          </div>

          <ClassifiedsSearchForm 
            initialFilters={filters} 
            onSearch={handleFiltersChange}
            layout="search"
          />

          {isLoading && classifieds.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">Error loading search results: {error.message}</p>
            </div>
          )}

          {!isLoading && !error && classifieds.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classifieds.map((classified) => (
                  <ClassifiedCard key={classified.id} classified={classified} />
                ))}
              </div>
              
              {isFetchingNextPage && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {!isLoading && !error && classifieds.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all classifieds.
              </p>
              <Link to="/classifieds">
                <Button className="bg-greenyp-600 hover:bg-greenyp-700">
                  Browse All Classifieds
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default SearchResults;
