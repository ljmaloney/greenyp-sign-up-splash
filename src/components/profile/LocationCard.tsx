
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import Map from '@/components/Map';
import { ProfileData } from '@/types/profile';

interface LocationCardProps {
  profile: ProfileData;
}

const LocationCard = ({ profile }: LocationCardProps) => {
  const formatAddress = () => {
    const parts = [
      profile.addressLine1,
      profile.addressLine2,
      profile.addressLine3,
      `${profile.city}, ${profile.state} ${profile.postalCode}`
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-greenyp-600" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        {profile.locationName && (
          <div className="mb-3">
            <span className="font-medium text-gray-700">Location Name: </span>
            <span className="text-gray-600">{profile.locationName}</span>
          </div>
        )}
        <div className="text-gray-600 mb-4">
          {formatAddress()}
        </div>
        <Map 
          latitude={profile.latitude}
          longitude={profile.longitude}
          businessName={profile.businessName}
        />
      </CardContent>
    </Card>
  );
};

export default LocationCard;
