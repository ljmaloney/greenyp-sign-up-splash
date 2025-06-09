
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ExampleBusinessCard from './ExampleBusinessCard';

interface ListingEmptyStateProps {
  categoryName: string;
}

const ListingEmptyState = ({ categoryName }: ListingEmptyStateProps) => {
  const handleListBusinessClick = () => {
    console.log('List Your Business button clicked from empty state - navigating to /subscriber/signup');
  };

  return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-8 text-lg">
        No listings for this line of business category, list your {categoryName.toLowerCase()} business today
      </p>
      
      <ExampleBusinessCard />
      
      <div className="mt-6">
        <Button asChild className="bg-greenyp-600 hover:bg-greenyp-700 text-white">
          <Link to="/subscriber/signup" onClick={handleListBusinessClick}>
            List Your Business
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ListingEmptyState;
