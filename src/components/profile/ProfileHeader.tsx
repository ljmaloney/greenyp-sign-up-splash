
import React from 'react';
import { MapPin, Phone, Globe, ExternalLink, Building2, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LocationMap from '@/components/LocationMap';
import { useBackNavigation } from '@/hooks/useBackNavigation';
import type { ProducerProfile } from '@/types/profile';

interface ProfileHeaderProps {
  profile: ProducerProfile;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const { handleBack, backLabel } = useBackNavigation();
  
  const fullAddress = [
    profile.addressLine1,
    profile.addressLine2,
    profile.addressLine3,
    `${profile.city}, ${profile.state} ${profile.postalCode}`
  ].filter(Boolean).join(', ');

  return (
    <>
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {backLabel}
        </Button>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start flex-1">
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
                <div>
                  {profile.locationName && profile.locationName !== profile.businessName && (
                      <p className="text-lg text-gray-600 mb-2 text-left">{profile.locationName}</p>
                  )}
                </div>
                <div>
                      <p className="text-sm text-gray-600 mb-2 text-left">{profile.businessNarrative}</p>
                </div>
              </div>
            </div>

            <div className="ml-8">
              <LocationMap
                latitude={profile.latitude}
                longitude={profile.longitude}
                businessName={profile.businessName}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileHeader;
