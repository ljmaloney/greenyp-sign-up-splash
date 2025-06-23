
import React from 'react';
import { Link, useParams } from 'react-router-dom';
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
import { Package, Wrench } from 'lucide-react';

interface ProfileContentProps {
  profile: ProfileData;
}

const ProfileContent = ({ profile }: ProfileContentProps) => {
  const params = useParams<{ producerId: string }>();
  const { data: subscriptions } = useSubscriptions();
  
  console.log('ProfileContent - Profile data:', profile);
  console.log('ProfileContent - Profile subscriptionIds:', profile.subscriptionIds);
  console.log('ProfileContent - Available subscriptions:', subscriptions);
  console.log('ProfileContent - URL producerId param:', params.producerId);
  
  // Check if any of the profile's subscriptionIds have the specified feature
  const hasFeature = (featureName: string): boolean => {
    if (!profile.subscriptionIds || !subscriptions) return false;
    
    return profile.subscriptionIds.some(subscriptionId => {
      const subscription = subscriptions.find(sub => sub.subscriptionId === subscriptionId);
      const hasFeatureInSubscription = subscription?.features?.some(feature => 
        feature.feature === featureName
      ) || false;
      
      console.log(`ProfileContent - Checking subscription ${subscriptionId} for feature ${featureName}:`, hasFeatureInSubscription);
      return hasFeatureInSubscription;
    });
  };
  
  const hasProductsFeature = hasFeature('products');
  const hasServicesFeature = hasFeature('services');
  
  console.log('ProfileContent - Features:', { hasProductsFeature, hasServicesFeature });
  console.log('ProfileContent - Using profile producerId:', profile.producerId, 'locationId:', profile.locationId);

  // Use the producerLocationId from URL parameter for navigation links (same as what we use for API calls)
  const producerLocationId = params.producerId;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader profile={profile} />

          {/* Product and Service Links */}
          {(hasProductsFeature || hasServicesFeature) && (
            <div className="flex flex-wrap gap-4 mb-8">
              {hasProductsFeature && (
                <Link
                  to={`/profile/${producerLocationId}/products`}
                  className="inline-flex items-center px-4 py-2 bg-greenyp-600 text-white rounded-lg hover:bg-greenyp-700 transition-colors"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View Products
                </Link>
              )}
              {hasServicesFeature && (
                <Link
                  to={`/profile/${producerLocationId}/services`}
                  className="inline-flex items-center px-4 py-2 bg-greenyp-600 text-white rounded-lg hover:bg-greenyp-700 transition-colors"
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  View Services
                </Link>
              )}
            </div>
          )}

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
                <ProductsList producerId={profile.producerId} locationId={profile.locationId} maxItems={7} />
              )}
              {hasServicesFeature && profile.locationId && (
                <ServicesList producerId={profile.producerId} locationId={profile.locationId} maxItems={7} />
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
