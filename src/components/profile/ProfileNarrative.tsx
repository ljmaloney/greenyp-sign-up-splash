
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProducerProfile } from '@/types/profile';

interface ProfileNarrativeProps {
  profile: ProducerProfile;
}

const ProfileNarrative = ({ profile }: ProfileNarrativeProps) => {
  if (!profile.businessNarrative) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About {profile.businessName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {profile.businessNarrative}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfileNarrative;
