
import React from 'react';
import { ProfileData } from '@/types/profile';

interface ProfileHeaderProps {
  profile: ProfileData;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{profile.businessName}</h1>
      
      {profile.narrative && (
        <div className="bg-greenyp-50 p-6 rounded-lg border border-greenyp-200 mb-8">
          <p className="text-gray-700 text-lg leading-relaxed">{profile.narrative}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
