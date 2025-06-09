
import React from 'react';
import SearchResultCard from './SearchResultCard';
import type { SearchResult } from '../types/search';

interface SearchResultsListProps {
  results: SearchResult[];
  expandedNarratives: Set<string>;
  onToggleNarrative: (resultId: string) => void;
}

const SearchResultsList = ({ results, expandedNarratives, onToggleNarrative }: SearchResultsListProps) => {
  return (
    <div className="grid gap-6 mb-8">
      {results.map((result) => (
        <SearchResultCard
          key={result.producerId}
          result={result}
          isNarrativeExpanded={expandedNarratives.has(result.producerId)}
          onToggleNarrative={onToggleNarrative}
        />
      ))}
    </div>
  );
};

export default SearchResultsList;
