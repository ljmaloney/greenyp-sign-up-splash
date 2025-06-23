
import React from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileAbout from './ProfileAbout';
import ProfileProducts from './ProfileProducts';
import ProfileServices from './ProfileServices';
import ProfileContactInfo from './ProfileContactInfo';
import ProfileBusinessHours from './ProfileBusinessHours';
import type { ProducerProfile, ProductsResponse, ServicesResponse } from '@/types/profile';

interface ProfileLayoutProps {
  profileData: ProducerProfile;
  products: ProductsResponse | null;
  services: ServicesResponse | null;
  onBackClick: () => void;
}

const ProfileLayout = ({ profileData, products, services, onBackClick }: ProfileLayoutProps) => {
  const hasFeature = (featureName: string): boolean => {
    return true;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4">
      <ProfileHeader 
        businessName={profileData.businessName}
        locationName={profileData.locationName}
        onBackClick={onBackClick}
      />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileAbout businessNarrative={profileData.businessNarrative} />
          <ProfileProducts products={products} hasFeature={hasFeature} />
          <ProfileServices services={services} hasFeature={hasFeature} />
        </div>

        {/* Right Column - Contact & Hours */}
        <div className="space-y-6">
          <ProfileContactInfo profile={profileData} />
          <ProfileBusinessHours locationHours={profileData.locationHours} />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
