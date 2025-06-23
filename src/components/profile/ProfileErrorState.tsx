
import React from 'react';
import ProfileHeader from './ProfileHeader';

interface ProfileErrorStateProps {
  error: string;
  onBackClick: () => void;
}

const ProfileErrorState = ({ error, onBackClick }: ProfileErrorStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The requested profile could not be found.'}</p>
        <ProfileHeader 
          businessName="Profile Not Found"
          onBackClick={onBackClick}
        />
      </div>
    </div>
  );
};

export default ProfileErrorState;
