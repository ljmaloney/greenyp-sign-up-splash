
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SearchResultsEmptyState = () => {
  return (
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
  );
};

export default SearchResultsEmptyState;
