
import React from 'react';
import SearchResultsLayout from '@/components/search/SearchResultsLayout';
import SearchResultsContent from '@/components/search/SearchResultsContent';
import SearchLoadingState from '@/components/search/SearchLoadingState';
import SearchErrorState from '@/components/search/SearchErrorState';
import { useSearchResults } from '@/hooks/useSearchResults';

const SearchResults = () => {
  const {
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
  } = useSearchResults();

  if (loading) {
    return <SearchLoadingState />;
  }

  if (error) {
    return <SearchErrorState error={error} />;
  }

  return (
    <SearchResultsLayout>
      <SearchResultsContent
        results={results}
        categoryName={categoryName}
        distance={distance}
        zipCode={zipCode}
        searchText={searchText}
        page={page}
        showSearchForm={showSearchForm}
        setShowSearchForm={setShowSearchForm}
        expandedNarratives={expandedNarratives}
        toggleNarrative={toggleNarrative}
        isApiSuccess={isApiSuccess}
      />
    </SearchResultsLayout>
  );
};

export default SearchResults;
