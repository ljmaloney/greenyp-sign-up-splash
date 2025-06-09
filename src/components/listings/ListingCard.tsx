
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Globe, ExternalLink, Building2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProducerListing } from '@/services/producerProfileService';

interface ListingCardProps {
  listing: ProducerListing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  // Helper function to create profile URL
  const createProfileUrl = (listing: ProducerListing) => {
    const params = new URLSearchParams({
      locationId: listing.producerLocationId,
      businessName: listing.businessName
    });
    return `/profile/${listing.producerId}?${params.toString()}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
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
  );
};

export default ListingCard;
