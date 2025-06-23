
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Smartphone, Mail, Globe } from 'lucide-react';
import type { ProducerProfile } from '@/types/profile';

interface ContactInfoCardProps {
  profile: ProducerProfile;
}

const ContactInfoCard = ({ profile }: ContactInfoCardProps) => {
  const fullAddress = [
    profile.addressLine1,
    profile.addressLine2,
    profile.addressLine3
  ].filter(Boolean).join(', ');

  const cityStateZip = `${profile.city}, ${profile.state} ${profile.postalCode}`;
  const completeAddress = fullAddress ? `${fullAddress}\n${cityStateZip}` : cityStateZip;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-greenyp-600">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-greenyp-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Address: {completeAddress || '-'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-greenyp-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Phone: {profile.phone || '-'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-greenyp-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Cell Phone: {profile.cellPhone || '-'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-greenyp-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Email Address: {profile.emailAddress || '-'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-greenyp-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Website URL :&nbsp;
            {profile.websiteUrl ? (
              <a 
                href={profile.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-greenyp-600 hover:text-greenyp-700 underline"
              >
                {profile.websiteUrl}
              </a>
            ) : (
              <span className="text-gray-600">-</span>
            )}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
