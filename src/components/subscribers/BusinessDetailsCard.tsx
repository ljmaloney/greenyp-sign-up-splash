
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin, Globe } from 'lucide-react';
import { Producer, PrimaryLocation } from '@/services/accountService';

interface BusinessDetailsCardProps {
  producer: Producer | null;
  primaryLocation: PrimaryLocation | null;
  lineOfBusinessName: string;
  isLoading?: boolean;
}

const BusinessDetailsCard = ({ 
  producer, 
  primaryLocation, 
  lineOfBusinessName, 
  isLoading 
}: BusinessDetailsCardProps) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!producer || !primaryLocation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No business details available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Business Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          {producer.iconLink && (
            <img 
              src={producer.iconLink} 
              alt={`${producer.businessName} logo`}
              className="w-12 h-12 object-contain rounded-md border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{producer.businessName}</h3>
            {producer.narrative && (
              <p className="text-gray-600 text-sm mb-2">
                {truncateText(producer.narrative, 150)}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Category:</span>
            <span className="font-medium">{lineOfBusinessName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">
              {primaryLocation.city}, {primaryLocation.state} {primaryLocation.postalCode}
            </span>
          </div>
          
          {producer.websiteUrl && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Website:</span>
              <a 
                href={producer.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {producer.websiteUrl.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessDetailsCard;
