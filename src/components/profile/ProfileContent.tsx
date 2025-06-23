
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
    </div>
  );
};

export default ProfileContent;
