
import React from 'react';

interface SearchResultsErrorStateProps {
  error: Error;
}

const SearchResultsErrorState = ({ error }: SearchResultsErrorStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-red-600">Error loading search results: {error.message}</p>
    </div>
  );
};

export default SearchResultsErrorState;
