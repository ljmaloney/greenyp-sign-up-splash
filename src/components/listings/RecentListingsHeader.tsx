
import React from 'react';

interface RecentListingsHeaderProps {
  categoryName: string;
}

const RecentListingsHeader = ({ categoryName }: RecentListingsHeaderProps) => {
  return (
    <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Recent {categoryName} Listings</h2>
  );
};

export default RecentListingsHeader;
