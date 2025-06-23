
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProducerProfile } from '@/types/profile';

interface ProfileDetailsProps {
  profile: ProducerProfile;
}

const ProfileDetails = ({ profile }: ProfileDetailsProps) => {
  return (
    <div className="space-y-6">
      {profile.businessNarrative && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {profile.businessNarrative}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Location Type:</span>
              <p className="text-gray-600 capitalize">
                {profile.locationType.toLowerCase().replace('_', ' ')}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Display Type:</span>
              <p className="text-gray-600 capitalize">
                {profile.locationDisplayType.toLowerCase().replace('_', ' ')}
              </p>
            </div>
            {profile.cellPhone && (
              <div>
                <span className="font-medium text-gray-900">Cell Phone:</span>
                <p className="text-gray-600">{profile.cellPhone}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDetails;
