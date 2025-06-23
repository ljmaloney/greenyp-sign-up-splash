
import React from 'react';
import { MapPin, Phone, Globe, ExternalLink, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ProducerProfile } from '@/types/profile';

interface ProfileHeaderProps {
  profile: ProducerProfile;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const fullAddress = [
    profile.addressLine1,
    profile.addressLine2,
    profile.addressLine3,
    `${profile.city}, ${profile.state} ${profile.postalCode}`
  ].filter(Boolean).join(', ');

  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          {profile.iconLink ? (
            <img 
              src={profile.iconLink} 
              alt={`${profile.businessName} icon`}
              className="w-16 h-16 mr-4 rounded-lg object-cover"
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
            <Building2 className="w-16 h-16 mr-4 text-greenyp-600" />
          )}
          {profile.iconLink && (
            <Building2 className="w-16 h-16 mr-4 text-greenyp-600 hidden" />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile.businessName}
            </h1>
            {profile.locationName && profile.locationName !== profile.businessName && (
              <p className="text-lg text-gray-600 mb-2">{profile.locationName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{fullAddress}</span>
          </div>
          
          {profile.phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
              <a href={`tel:${profile.phone}`} className="hover:text-greenyp-600">
                {profile.phone}
              </a>
            </div>
          )}
          
          {profile.websiteUrl && (
            <div className="flex items-center text-gray-600 md:col-span-2">
              <Globe className="w-5 h-5 mr-3 flex-shrink-0" />
              <a 
                href={profile.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-greenyp-600 flex items-center"
              >
                {profile.websiteUrl}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
