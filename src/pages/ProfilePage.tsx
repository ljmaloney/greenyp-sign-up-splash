
import React from 'react';
import ProfilePageLayout from '@/components/profile/ProfilePageLayout';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileLoadingState from '@/components/profile/ProfileLoadingState';
import ProfileErrorState from '@/components/profile/ProfileErrorState';
import { useProfileData } from '@/hooks/useProfileData';

const ProfilePage = () => {
  const { profile, isLoading, error } = useProfileData();
  
  if (isLoading) {
    return <ProfileLoadingState />;
  }
  
  if (error && !profile) {
    return <ProfileErrorState />;
  }

  return (
    <ProfilePageLayout>
      <ProfileNavigation />
      <ProfileContent profile={profile!} />
    </ProfilePageLayout>
  );
};

export default ProfilePage;
