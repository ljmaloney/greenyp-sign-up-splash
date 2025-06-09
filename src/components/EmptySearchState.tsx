
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface EmptySearchStateProps {
  isApiSuccess: boolean;
}

const EmptySearchState = ({ isApiSuccess }: EmptySearchStateProps) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {isApiSuccess ? 'No providers found' : 'No providers found'}
      </h3>
      <p className="text-gray-600 mb-6">
        {isApiSuccess 
          ? 'Your search criteria returned no results. Please update your search parameters and try again.'
          : 'Try expanding your search distance or removing some filters.'
        }
      </p>
      <Link to="/">
        <Button className="bg-greenyp-600 hover:bg-greenyp-700">
          Start New Search
        </Button>
      </Link>
    </div>
  );
};

export default EmptySearchState;
