
import React, { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClassifiedsHeader from '@/components/ClassifiedsHeader';
import ClassifiedsFooter from '@/components/classifieds/ClassifiedsFooter';
import ClassifiedsSearchForm from '@/components/classifieds/ClassifiedsSearchForm';
import SearchResultsHeader from '@/components/classifieds/SearchResultsHeader';
import SearchResultsDescription from '@/components/classifieds/SearchResultsDescription';
import SearchResultsContent from '@/components/classifieds/SearchResultsContent';
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

  return (
    <div className="min-h-screen flex flex-col">
      <ClassifiedsHeader />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <SearchResultsHeader />
          <SearchResultsDescription filters={filters} />

          <ClassifiedsSearchForm 
            initialFilters={filters} 
            onSearch={handleFiltersChange}
            layout="search"
          />

          <SearchResultsContent
            classifieds={classifieds}
            isLoading={isLoading}
            error={error}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      </main>
      <ClassifiedsFooter />
    </div>
  );
};

export default SearchResults;
