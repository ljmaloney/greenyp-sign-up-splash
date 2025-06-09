
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Building2 } from 'lucide-react';

interface ListingEmptyStateProps {
  categoryName: string;
}

const ListingEmptyState = ({ categoryName }: ListingEmptyStateProps) => {
  const handleListBusinessClick = () => {
    console.log('List Your Business button clicked from empty state - navigating to /subscriber/signup');
  };

  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
      <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No {categoryName} providers found
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Be the first {categoryName.toLowerCase()} professional to list your business in this area.
      </p>
      <Button asChild className="bg-greenyp-600 hover:bg-greenyp-700 text-white">
        <Link to="/subscriber/signup" onClick={handleListBusinessClick}>
          List Your Business
        </Link>
      </Button>
    </div>
  );
};

export default ListingEmptyState;
