
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Phone, Globe } from 'lucide-react';
import { ProfileData } from '@/types/profile';

interface ContactInformationProps {
  profile: ProfileData;
}

const ContactInformation = ({ profile }: ContactInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="w-5 h-5 mr-2 text-greenyp-600" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {profile.contactName && (
          <div>
            <span className="font-medium text-gray-700">Contact: </span>
            <span className="text-gray-600">{profile.contactName}</span>
          </div>
        )}
        {profile.phoneNumber && (
          <div>
            <span className="font-medium text-gray-700">Phone: </span>
            <a href={`tel:${profile.phoneNumber}`} className="text-greenyp-600 hover:underline">
              {profile.phoneNumber}
            </a>
          </div>
        )}
        {profile.cellPhoneNumber && (
          <div>
            <span className="font-medium text-gray-700">Cell: </span>
            <a href={`tel:${profile.cellPhoneNumber}`} className="text-greenyp-600 hover:underline">
              {profile.cellPhoneNumber}
            </a>
          </div>
        )}
        {profile.websiteUrl && (
          <div>
            <span className="font-medium text-gray-700">Website: </span>
            <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" 
               className="text-greenyp-600 hover:underline inline-flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              Visit Website
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactInformation;
