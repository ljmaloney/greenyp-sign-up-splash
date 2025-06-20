
import React from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAccountData } from '@/hooks/useAccountData';

interface GalleryFeatureCheckerProps {
  children: (props: {
    maxGalleryCount: number;
    hasGalleryFeature: boolean;
    isLoading: boolean;
  }) => React.ReactNode;
}

const GalleryFeatureChecker = ({ children }: GalleryFeatureCheckerProps) => {
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const { data: accountData, isLoading: accountLoading } = useAccountData();

  // Get current subscription ID from account data
  const currentSubscriptionId = accountData?.producer?.subscriptions?.[0]?.subscriptionId;
  
  // Find the current subscription details
  const currentSubscription = subscriptions?.find(sub => sub.subscriptionId === currentSubscriptionId);
  
  // Get gallery feature configuration
  const galleryFeature = currentSubscription?.features.find(feature => feature.feature === 'gallery');
  const maxGalleryCount = galleryFeature?.configMap?.maxGalleryCount || 0;
  const hasGalleryFeature = maxGalleryCount > 0;

  const isLoading = subscriptionsLoading || accountLoading;

  return <>{children({ maxGalleryCount, hasGalleryFeature, isLoading })}</>;
};

export default GalleryFeatureChecker;
