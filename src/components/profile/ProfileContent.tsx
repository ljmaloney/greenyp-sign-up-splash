
import React from 'react';
import ProfileHeader from './ProfileHeader';
import ContactInformation from './ContactInformation';
import LocationCard from './LocationCard';
import BusinessHours from './BusinessHours';
import ProfileGallery from './ProfileGallery';
import ActionButtons from './ActionButtons';
import ProductsList from './ProductsList';
import ServicesList from './ServicesList';
import { ProfileData } from '@/types/profile';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface ProfileContentProps {
  profile: ProfileData;
}

const ProfileContent = ({ profile }: ProfileContentProps) => {
  const { data: subscriptions } = useSubscriptions();
  
  // Find the subscription details
  const currentSubscription = subscriptions?.find(sub => sub.subscriptionId === profile?.subscriptionId);
  
  // Check if subscription includes Products or Services features using the feature property
  const hasProductsFeature = currentSubscription?.features.some(feature => 
    feature.feature === 'products') || false;
  const hasServicesFeature = currentSubscription?.features.some(feature => 
    feature.feature === 'services') || false;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader profile={profile} />

          {/* Contact and Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ContactInformation profile={profile} />
            <LocationCard profile={profile} />
          </div>

          {/* Business Hours */}
          <div className="mb-8">
            <BusinessHours profile={profile} />
          </div>

          {/* Photo Gallery */}
          <div className="mb-8">
            <ProfileGallery profile={profile} />
          </div>

          {/* Products and Services */}
          {(hasProductsFeature || hasServicesFeature) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {hasProductsFeature && profile.locationId && (
                <ProductsList locationId={profile.locationId} />
              )}
              {hasServicesFeature && profile.locationId && (
                <ServicesList producerId={profile.producerId} locationId={profile.locationId} />
              )}
            </div>
          )}

          {/* Action Buttons */}
          <ActionButtons profile={profile} />
        </div>
      </div>
    </section>
  );
};

export default ProfileContent;
