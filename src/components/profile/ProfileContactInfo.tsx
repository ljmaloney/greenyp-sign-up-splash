
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Globe, ExternalLink } from 'lucide-react';
import type { ProducerProfile } from '@/types/profile';

interface ProfileContactInfoProps {
  profile: ProducerProfile;
}

const ProfileContactInfo = ({ profile }: ProfileContactInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start text-gray-600">
          <MapPin className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p>{profile.addressLine1}</p>
            {profile.addressLine2 && <p>{profile.addressLine2}</p>}
            <p>{profile.city}, {profile.state} {profile.postalCode}</p>
          </div>
        </div>
        
        {profile.phone && (
          <div className="flex items-center text-gray-600">
            <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
            <a href={`tel:${profile.phone}`} className="hover:text-greenyp-600 transition-colors">
              {profile.phone}
            </a>
          </div>
        )}

        {profile.cellPhone && (
          <div className="flex items-center text-gray-600">
            <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
            <a href={`tel:${profile.cellPhone}`} className="hover:text-greenyp-600 transition-colors">
              {profile.cellPhone} (Cell)
            </a>
          </div>
        )}
        
        {profile.websiteUrl && (
          <div className="flex items-center text-gray-600">
            <Globe className="w-5 h-5 mr-3 flex-shrink-0" />
            <a 
              href={profile.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-greenyp-600 transition-colors flex items-center"
            >
              Visit Website
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileContactInfo;
