
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Globe, Eye, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { SearchResult } from '../types/search';

interface SearchResultCardProps {
  result: SearchResult;
  isNarrativeExpanded: boolean;
  onToggleNarrative: (resultId: string) => void;
}

// Helper function to construct full address from separate fields
const constructAddress = (result: SearchResult): string => {
  const addressParts = [
    result.addressLine1,
    result.addressLine2,
    result.addressLine3
  ].filter(Boolean); // Remove empty/null values
  
  const addressLine = addressParts.join(' ');
  const cityStateZip = [result.city, result.state, result.postalCode].filter(Boolean).join(', ');
  
  return [addressLine, cityStateZip].filter(Boolean).join(', ');
};

// Helper function to truncate narrative text
const truncateNarrative = (narrative: string, maxLength: number = 150) => {
  if (narrative.length <= maxLength) return narrative;
  return narrative.substring(0, maxLength) + '...';
};

// Helper function to create profile URL with the exact format specified
const createProfileUrl = (result: SearchResult) => {
  return `/profile/${result.producerId}/location/${result.producerLocationId}`;
};

const generateMapUrl = (latitude: string, longitude: string, businessName: string) => {
  // Using Google Maps static API for small map images
  const encodedName = encodeURIComponent(businessName);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=200x150&markers=color:red%7C${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`;
};

const SearchResultCard = ({ result, isNarrativeExpanded, onToggleNarrative }: SearchResultCardProps) => {
  const location = useLocation();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Business Info */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                {result.iconLink && (
                  <img 
                    src={result.iconLink} 
                    alt={`${result.businessName} icon`}
                    className="w-8 h-8 mr-3 rounded"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                <Link 
                  to={createProfileUrl(result)}
                  state={{ from: location.pathname + location.search }}
                  className="text-xl font-semibold text-gray-900 hover:text-greenyp-600 transition-colors"
                >
                  {result.businessName}
                </Link>
              </div>
              <Link 
                to={createProfileUrl(result)}
                state={{ from: location.pathname + location.search }}
                className="flex items-center text-greenyp-600 hover:text-greenyp-700 text-sm font-medium"
              >
                <Eye className="w-4 h-4 mr-1" />
                View Profile
              </Link>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600 flex-wrap">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="mr-4">{constructAddress(result)}</span>
                {result.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <a href={`tel:${result.phone}`} className="hover:text-greenyp-600">
                      {result.phone}
                    </a>
                  </div>
                )}
              </div>
              
              {result.websiteUrl && (
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a 
                    href={result.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-greenyp-600 truncate flex items-center"
                  >
                    {result.websiteUrl}
                    <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                  </a>
                </div>
              )}

              {result.businessNarrative && (
                <div className="text-gray-600">
                  <p className="mb-1">
                    {isNarrativeExpanded 
                      ? result.businessNarrative 
                      : truncateNarrative(result.businessNarrative)
                    }
                  </p>
                  {result.businessNarrative.length > 150 && (
                    <button
                      onClick={() => onToggleNarrative(result.producerId)}
                      className="text-greenyp-600 hover:text-greenyp-700 text-sm font-medium flex items-center"
                    >
                      {isNarrativeExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3 mr-1" />
                          Read More
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              Distance: {result.distance.toFixed(1)} miles
            </div>
          </div>

          {/* Map */}
          <div className="flex-shrink-0">
            <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              {result.latitude && result.longitude ? (
                <img
                  src={generateMapUrl(result.latitude, result.longitude, result.businessName)}
                  alt={`Map location for ${result.businessName}`}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    // Fallback when Google Maps API key is not available
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                <MapPin className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResultCard;
