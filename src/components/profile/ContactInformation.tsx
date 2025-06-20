
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Phone, Globe, Mail } from 'lucide-react';
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
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Contact:</span>
          <span className="text-gray-600 text-right">
            {profile.contactName || '-'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Phone:</span>
          <div className="text-right">
            {profile.phoneNumber ? (
              <a href={`tel:${profile.phoneNumber}`} className="text-greenyp-600 hover:underline">
                {profile.phoneNumber}
              </a>
            ) : (
              <span className="text-gray-600">-</span>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Cell:</span>
          <div className="text-right">
            {profile.cellPhoneNumber ? (
              <a href={`tel:${profile.cellPhoneNumber}`} className="text-greenyp-600 hover:underline">
                {profile.cellPhoneNumber}
              </a>
            ) : (
              <span className="text-gray-600">-</span>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Email:</span>
          <span className="text-gray-600 text-right">-</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Website:</span>
          <div className="text-right">
            {profile.websiteUrl ? (
              <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" 
                 className="text-greenyp-600 hover:underline inline-flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                Visit Website
              </a>
            ) : (
              <span className="text-gray-600">-</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInformation;
