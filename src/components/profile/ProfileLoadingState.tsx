
import React from 'react';

const ProfileLoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greenyp-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    </div>
  );
};

export default ProfileLoadingState;
