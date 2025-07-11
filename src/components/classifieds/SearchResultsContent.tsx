
import React from 'react';
import { ClassifiedFilters, Classified } from '@/types/classifieds';
import ClassifiedCard from './ClassifiedCard';
import SearchResultsLoadingState from './SearchResultsLoadingState';
import SearchResultsErrorState from './SearchResultsErrorState';
import SearchResultsEmptyState from './SearchResultsEmptyState';

interface SearchResultsContentProps {
  classifieds: Classified[];
  isLoading: boolean;
  error: Error | null;
  isFetchingNextPage: boolean;
}

const SearchResultsContent = ({ 
  classifieds, 
  isLoading, 
  error, 
  isFetchingNextPage 
}: SearchResultsContentProps) => {
  if (isLoading && classifieds.length === 0) {
    return <SearchResultsLoadingState />;
  }

  if (error) {
    return <SearchResultsErrorState error={error} />;
  }

  if (!isLoading && !error && classifieds.length === 0) {
    return <SearchResultsEmptyState />;
  }

  return (
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
  );
};

export default SearchResultsContent;
