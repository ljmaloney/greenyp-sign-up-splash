
import React from 'react';
import type { ProducerProfile } from '@/types/profile';
import ProfileHeader from './ProfileHeader';
import ProfileDetails from './ProfileDetails';
import ProfileHours from './ProfileHours';

interface ProfileContentProps {
  profile: ProducerProfile;
}

const ProfileContent = ({ profile }: ProfileContentProps) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProfileHeader profile={profile} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <ProfileDetails profile={profile} />
        </div>
        <div>
          <ProfileHours hours={profile.locationHours} />
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
