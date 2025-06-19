
import { Producer } from '@/services/accountService';
import { useSubscriptions } from '@/hooks/useSubscriptions';

export interface FeatureFlags {
  hasProductsFeature: boolean;
  hasServicesFeature: boolean;
  hasLogoFeature: boolean;
}

interface FeatureCheckerProps {
  producer: Producer;
  hasPhotoGalleryFeature: boolean;
  children: (features: FeatureFlags & { hasPhotoGalleryFeature: boolean }) => React.ReactNode;
}

const FeatureChecker = ({ producer, hasPhotoGalleryFeature, children }: FeatureCheckerProps) => {
  const { data: subscriptions } = useSubscriptions();

  // Get current subscription ID from producer subscriptions
  const currentSubscriptionId = producer.subscriptions?.[0]?.subscriptionId;
  
  // Find the current subscription details from the subscriptions list
  const currentSubscription = subscriptions?.find(sub => sub.subscriptionId === currentSubscriptionId);
  
  // Check subscription features
  const hasProductsFeature = currentSubscription?.features.some(feature => 
    feature.feature === 'products') || false;
  const hasServicesFeature = currentSubscription?.features.some(feature => 
    feature.feature === 'services') || false;
  const hasLogoFeature = currentSubscription?.features.some(feature => 
    feature.feature === 'logo') || false;

  return <>{children({ 
    hasProductsFeature, 
    hasServicesFeature, 
    hasLogoFeature, 
    hasPhotoGalleryFeature 
  })}</>;
};

export default FeatureChecker;
