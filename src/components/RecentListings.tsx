
import React from 'react';
import { useProducerProfiles } from '@/hooks/useProducerProfiles';
import RecentListingsHeader from './listings/RecentListingsHeader';
import ListingLoadingState from './listings/ListingLoadingState';
import ListingEmptyState from './listings/ListingEmptyState';
import ListingsList from './listings/ListingsList';

interface RecentListingsProps {
  lineOfBusinessId: string;
  categoryName: string;
}

const RecentListings = ({ lineOfBusinessId, categoryName }: RecentListingsProps) => {
  console.log('RecentListings: Loading with lineOfBusinessId:', lineOfBusinessId);
  
  const { data: profilesData, isLoading, error } = useProducerProfiles(lineOfBusinessId);

  console.log('RecentListings: profilesData:', profilesData);
  console.log('RecentListings: isLoading:', isLoading);
  console.log('RecentListings: error:', error);

  if (isLoading) {
    console.log('RecentListings: Rendering loading state');
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <RecentListingsHeader categoryName={categoryName} />
          <ListingLoadingState />
        </div>
      </section>
    );
  }

  // Treat both errors and empty results as "no listings available"
  // This will show the "No providers" box instead of error messages
  const listings = profilesData?.response || [];
  console.log('RecentListings: listings:', listings);

  if (error || listings.length === 0) {
    console.log('RecentListings: No listings found or API error, rendering empty state');
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <RecentListingsHeader categoryName={categoryName} />
          <ListingEmptyState categoryName={categoryName} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <RecentListingsHeader categoryName={categoryName} />
        <ListingsList listings={listings} categoryName={categoryName} />
      </div>
    </section>
  );
};

export default RecentListings;
