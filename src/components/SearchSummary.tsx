
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface SearchSummaryProps {
  categoryName: string;
  totalCount: number;
  distance: string;
  zipCode: string;
  searchText: string;
  onNewSearch: () => void;
}

const SearchSummary = ({ 
  categoryName, 
  totalCount, 
  distance, 
  zipCode, 
  searchText, 
  onNewSearch 
}: SearchSummaryProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryName || 'Green Industry Search Results'}
          </h1>
          <p className="text-gray-600">
            {totalCount || 0} providers found within {distance} miles of {zipCode}
            {searchText && (
              <span className="block mt-1">
                Searching for: "<span className="font-medium">{searchText}</span>"
              </span>
            )}
          </p>
        </div>
        <Button 
          onClick={onNewSearch}
          variant="outline"
          className="border-greenyp-600 text-greenyp-600 hover:border-yellow-500 hover:text-yellow-600 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          New Search
        </Button>
      </div>
    </div>
  );
};

export default SearchSummary;
