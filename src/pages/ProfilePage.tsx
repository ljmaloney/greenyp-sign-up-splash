
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducerProfile } from '@/hooks/useProfile';
import ProfilePageLayout from '@/components/profile/ProfilePageLayout';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileLoadingState from '@/components/profile/ProfileLoadingState';
import ProfileErrorState from '@/components/profile/ProfileErrorState';

const ProfilePage = () => {
  const { businessId, producerId, producerLocationId } = useParams<{ 
    businessId?: string;
    producerId?: string;
    producerLocationId?: string; 
  }>();
  
  // Use the appropriate ID based on which route was matched
  const profileId = producerLocationId || businessId;
  
  console.log('ProfilePage params:', { businessId, producerId, producerLocationId, profileId });
  
  const { data: profileResponse, isLoading, error } = useProducerProfile(profileId!);

  // Scroll to top when component mounts or when profile data changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [profileId, profileResponse]);

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
