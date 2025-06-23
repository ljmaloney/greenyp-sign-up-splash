
import React from 'react';
import SearchForm from '@/components/SearchForm';
import SearchSummary from '@/components/SearchSummary';
import SearchResultsList from '@/components/SearchResultsList';
import SearchPagination from '@/components/SearchPagination';
import EmptySearchState from '@/components/EmptySearchState';
import type { SearchResponse } from '@/types/search';

interface SearchResultsContentProps {
  results: SearchResponse | null;
  categoryName: string;
  distance: string;
  zipCode: string;
  searchText: string;
  page: number;
  showSearchForm: boolean;
  setShowSearchForm: (show: boolean) => void;
  expandedNarratives: Set<string>;
  toggleNarrative: (resultId: string) => void;
  isApiSuccess: boolean;
}

const SearchResultsContent = ({
  results,
  categoryName,
  distance,
  zipCode,
  searchText,
  page,
  showSearchForm,
  setShowSearchForm,
  expandedNarratives,
  toggleNarrative,
  isApiSuccess
}: SearchResultsContentProps) => {
  return (
    <div className="container mx-auto max-w-6xl">
      {/* Search Summary */}
      <SearchSummary
        categoryName={categoryName}
        totalCount={results?.totalCount || 0}
        distance={distance}
        zipCode={zipCode}
        searchText={searchText}
        onNewSearch={() => setShowSearchForm(!showSearchForm)}
      />

      {/* Search Form - Show when button is clicked */}
      {showSearchForm && (
        <div className="mb-8">
          <SearchForm showHeading={false} />
        </div>
      )}

      {/* Results */}
      {results && results.producerSearchResults.length > 0 ? (
        <>
          <SearchResultsList
            results={results.producerSearchResults}
            expandedNarratives={expandedNarratives}
            onToggleNarrative={toggleNarrative}
          />

          {/* Pagination */}
          <SearchPagination
            currentPage={page}
            totalPages={results.totalPages}
          />
        </>
      ) : (
        <EmptySearchState isApiSuccess={isApiSuccess} />
      )}
    </div>
  );
};

export default SearchResultsContent;
