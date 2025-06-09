
import React from 'react';
import { Button } from "@/components/ui/button";
import ExampleBusinessCard from './ExampleBusinessCard';

interface ListingEmptyStateProps {
  categoryName: string;
}

const ListingEmptyState = ({ categoryName }: ListingEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-8 text-lg">
        No listings for this line of business category, list your {categoryName.toLowerCase()} business today
      </p>
      
      <ExampleBusinessCard />
      
      <div className="mt-6">
        <Button className="bg-greenyp-600 hover:bg-greenyp-700 text-white">
          List Your Business
        </Button>
      </div>
    </div>
  );
};

export default ListingEmptyState;
