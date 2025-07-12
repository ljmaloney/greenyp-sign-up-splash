
import React from 'react';
import { ClassifiedFilters } from '@/types/classifieds';

interface SearchResultsDescriptionProps {
  filters: ClassifiedFilters;
}

const SearchResultsDescription = ({ filters }: SearchResultsDescriptionProps) => {
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
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
      <p className="text-gray-600">
        {getSearchDescription()}
      </p>
    </div>
  );
};

export default SearchResultsDescription;
