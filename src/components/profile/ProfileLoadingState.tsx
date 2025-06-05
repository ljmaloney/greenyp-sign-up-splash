
import React from 'react';
import ProfilePageLayout from './ProfilePageLayout';

const ProfileLoadingState = () => {
  return (
    <ProfilePageLayout>
      <main className="flex-grow container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Loading Profile...</h1>
      </main>
    </ProfilePageLayout>
  );
};

export default ProfileLoadingState;
