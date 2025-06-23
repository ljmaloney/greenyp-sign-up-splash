
import React from 'react';
import type { ProducerProfile } from '@/types/profile';
import ProfileHeader from './ProfileHeader';
import ProfileNarrative from './ProfileNarrative';
import ProfileGallery from './ProfileGallery';

interface ProfileContentProps {
  profile: ProducerProfile;
}

const ProfileContent = ({ profile }: ProfileContentProps) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <ProfileHeader profile={profile} />
        <ProfileNarrative profile={profile} />
        <ProfileGallery profile={profile} />
      </div>
    </div>
  );
};

export default ProfileContent;
