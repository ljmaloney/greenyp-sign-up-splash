
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Globe, ExternalLink, Building2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProducerProfiles } from '@/hooks/useProducerProfiles';
import type { ProducerListing } from '@/services/producerProfileService';

interface RecentListingsProps {
  lineOfBusinessId: string;
  categoryName: string;
}

const RecentListings = ({ lineOfBusinessId, categoryName }: RecentListingsProps) => {
  const { data: profilesData, isLoading, error } = useProducerProfiles(lineOfBusinessId);

  // Helper function to create profile URL
  const createProfileUrl = (listing: ProducerListing) => {
    const params = new URLSearchParams({
      locationId: listing.producerLocationId,
      businessName: listing.businessName
    });
    return `/profile/${listing.producerId}?${params.toString()}`;
  };

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent {categoryName} Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent {categoryName} Listings</h2>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error loading recent listings. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  const listings = profilesData?.response || [];

  if (listings.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent {categoryName} Listings</h2>
          <div className="text-center py-8">
            <p className="text-gray-600">No recent listings found for this category.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent {categoryName} Listings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.slice(0, 6).map((listing) => (
            <Card key={listing.producerId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  {listing.iconLink ? (
                    <img 
                      src={listing.iconLink} 
                      alt={`${listing.businessName} icon`}
                      className="w-8 h-8 mr-3 rounded object-cover flex-shrink-0"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        // Show fallback icon when image fails to load
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'block';
                        }
                      }}
                    />
                  ) : (
                    <Building2 className="w-8 h-8 mr-3 text-greenyp-600 flex-shrink-0" />
                  )}
                  {listing.iconLink && (
                    <Building2 className="w-8 h-8 mr-3 text-greenyp-600 flex-shrink-0 hidden" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {listing.businessName}
                  </h3>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{listing.city}, {listing.state}</span>
                  </div>
                  
                  {listing.phone && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <a href={`tel:${listing.phone}`} className="hover:text-greenyp-600 truncate">
                        {listing.phone}
                      </a>
                    </div>
                  )}
                  
                  {listing.websiteUrl && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                      <a 
                        href={listing.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-greenyp-600 truncate flex items-center"
                      >
                        Website
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
                
                <Link to={createProfileUrl(listing)}>
                  <Button className="w-full bg-greenyp-600 hover:bg-greenyp-700 text-white">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {listings.length > 6 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
              View All {categoryName} Providers
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentListings;
