
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProducerProfile } from '@/hooks/useProfile';
import ProfilePageLayout from '@/components/profile/ProfilePageLayout';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileLoadingState from '@/components/profile/ProfileLoadingState';
import ProfileErrorState from '@/components/profile/ProfileErrorState';

const ProfilePage = () => {
  const { producerId, producerLocationId } = useParams<{ 
    producerId: string;
    producerLocationId: string; 
  }>();
  
  const { data: profileResponse, isLoading, error } = useProducerProfile(producerLocationId!);

  if (isLoading) {
    return <ProfileLoadingState />;
  }

  if (error) {
    return <ProfileErrorState error={error} />;
  }

  if (!profileResponse?.response) {
    return <ProfileErrorState error={new Error('Profile not found')} />;
  }

  return (
    <ProfilePageLayout>
      <ProfileContent profile={profileResponse.response} />
    </ProfilePageLayout>
  );
};

export default ProfilePage;
