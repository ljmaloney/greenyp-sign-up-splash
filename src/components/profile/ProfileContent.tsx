
import React from 'react';
import type { ProducerProfile } from '@/types/profile';
import ProfileHeader from './ProfileHeader';
import ProfileNarrative from './ProfileNarrative';
import ProfileGallery from './ProfileGallery';
import ProfileHours from './ProfileHours';

interface ProfileContentProps {
  profile: ProducerProfile;
}

const ProfileContent = ({ profile }: ProfileContentProps) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProfileHeader profile={profile} />
          <ProfileNarrative profile={profile} />
          <ProfileGallery profile={profile} />
        </div>
        <div>
          {profile.locationHours && profile.locationHours.length > 0 && (
            <ProfileHours hours={profile.locationHours} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
