
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Globe, Building2 } from 'lucide-react';

interface Producer {
  producerId: string;
  producerLocationId: string;
  businessName: string;
  phone?: string;
  cellPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  websiteUrl?: string;
  latitude?: string;
  longitude?: string;
  businessNarrative?: string;
  iconLink?: string;
}

interface ListingCardProps {
  producer: Producer;
  categoryName: string;
}

const ListingCard = ({ producer, categoryName }: ListingCardProps) => {
  const fullAddress = [
    producer.city,
    producer.state,
    producer.postalCode
  ].filter(Boolean).join(', ');

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="border-greenyp-200 hover:border-yellow-500 transition-colors duration-200 h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start mb-4">
          {producer.iconLink ? (
            <img 
              src={producer.iconLink} 
              alt={`${producer.businessName} icon`}
              className="w-12 h-12 mr-4 rounded-lg object-cover flex-shrink-0"
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
            <Building2 className="w-12 h-12 mr-4 text-greenyp-600 flex-shrink-0" />
          )}
          {producer.iconLink && (
            <Building2 className="w-12 h-12 mr-4 text-greenyp-600 hidden flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 break-words">
              {producer.businessName}
            </h3>
            {fullAddress && (
              <div className="flex items-start text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1 text-greenyp-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm break-words">{fullAddress}</span>
              </div>
            )}
          </div>
        </div>

        {producer.businessNarrative && (
          <div className="mb-4 flex-grow">
            <p className="text-gray-700 text-sm leading-relaxed">
              {truncateText(producer.businessNarrative, 150)}
            </p>
          </div>
        )}

        <div className="space-y-2 mb-4">
          {producer.phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-2 text-greenyp-600 flex-shrink-0" />
              <span className="text-sm break-all">{producer.phone}</span>
            </div>
          )}
          {producer.websiteUrl && (
            <a 
              href={producer.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-greenyp-600 hover:text-greenyp-700 group"
            >
              <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm group-hover:underline break-all">Visit Website</span>
            </a>
          )}
        </div>

        <div className="mt-auto">
          <Link 
            to={`/greenpro/profile/${producer.producerId}/${producer.producerLocationId}`}
            state={{ from: window.location.pathname }}
            className="inline-block w-full bg-greenyp-600 hover:bg-greenyp-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200 text-center"
          >
            View Profile
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;
