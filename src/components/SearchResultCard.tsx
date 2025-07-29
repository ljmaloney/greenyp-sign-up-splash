
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Globe, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import type { SearchResult } from '../types/search';
import LocationMap from './LocationMap';

interface SearchResultCardProps {
  result: SearchResult;
  isNarrativeExpanded: boolean;
  onToggleNarrative: (resultId: string) => void;
}

const SearchResultCard = ({ result, isNarrativeExpanded, onToggleNarrative }: SearchResultCardProps) => {
  const fullAddress = [
    result.addressLine1,
    result.addressLine2, 
    result.addressLine3,
    `${result.city}, ${result.state} ${result.postalCode}`
  ].filter(Boolean).join(', ');

  const shouldTruncateNarrative = result.businessNarrative && result.businessNarrative.length > 200;
  const displayNarrative = shouldTruncateNarrative && !isNarrativeExpanded 
    ? result.businessNarrative.substring(0, 200) + '...'
    : result.businessNarrative;

  return (
    <Card className="border-greenyp-200 hover:border-yellow-500 transition-colors duration-200">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Main Content Column */}
          <div className="flex-1">
            <div className="flex items-start mb-4">
              {result.iconLink ? (
                <img 
                  src={result.iconLink} 
                  alt={`${result.businessName} icon`}
                  className="w-12 h-12 mr-4 rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'block';
                    }
                  }}
                />
              ) : (
                <Building2 className="w-12 h-12 mr-4 text-greenyp-600" />
              )}
              {result.iconLink && (
                <Building2 className="w-12 h-12 mr-4 text-greenyp-600 hidden" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {result.businessName}
                  </h3>
                  {result.websiteUrl && (
                    <a 
                      href={result.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-greenyp-600 hover:text-greenyp-700"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      <span className="text-sm">Visit Website</span>
                    </a>
                  )}
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1 text-greenyp-600" />
                  <span className="text-sm">{fullAddress}</span>
                  {result.phone && (
                    <div className="flex items-center text-gray-600 ml-4">
                      <Phone className="w-4 h-4 mr-2 text-greenyp-600" />
                      <span className="text-sm">{result.phone}</span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  {result.distance} miles away
                </div>
              </div>
            </div>

            {displayNarrative && (
              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {displayNarrative}
                </p>
                {shouldTruncateNarrative && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleNarrative(result.producerId)}
                    className="text-greenyp-600 hover:text-greenyp-700 p-0 h-auto mt-2"
                  >
                    {isNarrativeExpanded ? (
                      <>
                        Show less <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Read more <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            <Link 
              to={`/profile/${result.producerId}/${result.producerLocationId}`}
              state={{ from: window.location.pathname + window.location.search }}
              className="inline-block bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
            >
              View Full Profile
            </Link>
          </div>
          
          {/* Map Column */}
          {result.latitude && result.longitude && (
            <div className="flex-shrink-0">
              <LocationMap 
                latitude={result.latitude}
                longitude={result.longitude}
                businessName={result.businessName}
                width="w-48"
                height="h-36"
                showLinks={false}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResultCard;
