
import React from 'react';
import type { ProducerProfile } from '@/types/profile';
import ProfileHeader from './ProfileHeader';
import ProfileGallery from './ProfileGallery';
import ContactInfoCard from './ContactInfoCard';
import HoursCard from './HoursCard';
import ProfileProductsCard from './ProfileProductsCard';
import ProfileServicesCard from './ProfileServicesCard';

interface ProfileContentProps {
  profile: ProducerProfile;
}

const ProfileContent = ({ profile }: ProfileContentProps) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <ProfileHeader profile={profile} />
        
        {/* Contact and Hours Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContactInfoCard profile={profile} />
          <HoursCard profile={profile} />
        </div>
        
        {/* Products Card */}
        <ProfileProductsCard profile={profile} />
        
        {/* Services Card */}
        <ProfileServicesCard profile={profile} />
        
        <ProfileGallery profile={profile} />
      </div>
    </div>
  );
};

export default ProfileContent;
