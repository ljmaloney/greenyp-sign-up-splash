
import React from 'react';
import { useParams } from 'react-router-dom';
import ProfilePageLayout from '@/components/profile/ProfilePageLayout';

const BusinessProfile = () => {
  const { producerId } = useParams<{ producerId: string }>();

  return (
    <ProfilePageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Business Profile</h1>
          <p className="text-gray-600">Profile ID: {producerId}</p>
          <p className="text-gray-500 mt-4">Business profile content will be displayed here.</p>
        </div>
      </div>
    </ProfilePageLayout>
  );
};

export default BusinessProfile;
