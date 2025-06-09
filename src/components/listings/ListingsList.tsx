
import React from 'react';
import { Button } from "@/components/ui/button";
import ListingCard from './ListingCard';
import type { ProducerListing } from '@/services/producerProfileService';

interface ListingsListProps {
  listings: ProducerListing[];
  categoryName: string;
}

const ListingsList = ({ listings, categoryName }: ListingsListProps) => {
  console.log('ListingsList: Rendering listings, count:', listings.length);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.slice(0, 6).map((listing) => (
          <ListingCard key={listing.producerId} listing={listing} />
        ))}
      </div>
      
      {listings.length > 6 && (
        <div className="text-center mt-8">
          <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
            View All {categoryName} Providers
          </Button>
        </div>
      )}
    </>
  );
};

export default ListingsList;
