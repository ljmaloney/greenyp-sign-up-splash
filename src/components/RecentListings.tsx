
import React from 'react';
import { useProducerProfiles } from '@/hooks/useProducerProfiles';
import RecentListingsHeader from './listings/RecentListingsHeader';
import ListingLoadingState from './listings/ListingLoadingState';
import ListingErrorState from './listings/ListingErrorState';
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

  if (error) {
    console.log('RecentListings: Rendering error state, error:', error);
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <RecentListingsHeader categoryName={categoryName} />
          <ListingErrorState error={error} />
        </div>
      </section>
    );
  }

  const listings = profilesData?.response || [];
  console.log('RecentListings: listings:', listings);

  if (listings.length === 0) {
    console.log('RecentListings: No listings found, rendering empty state');
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
