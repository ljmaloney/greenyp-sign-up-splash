
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAccountData } from '@/hooks/useAccountData';

const BusinessOverviewCard = () => {
  const { data: subscriptions } = useSubscriptions();
  const { data: accountData } = useAccountData();

  // Get current subscription ID from account data
  const currentSubscriptionId = accountData?.producer?.subscriptions?.[0]?.subscriptionId;
  
  // Find the current subscription details
  const currentSubscription = subscriptions?.find(sub => sub.subscriptionId === currentSubscriptionId);
  
  // Check if subscription includes Products, Services, or Photo Gallery features using the feature property
  const hasProductsFeature = currentSubscription?.features.some(feature => 
    feature.feature === 'products') || false;
  const hasServicesFeature = currentSubscription?.features.some(feature => 
    feature.feature === 'services') || false;
  const hasPhotoGalleryFeature = currentSubscription?.features.some(feature => 
    feature.feature === 'gallery') || false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm">
            <span className="font-medium">Products:</span>
            <span className={hasProductsFeature ? "text-green-600 ml-2" : "text-gray-400 ml-2"}>
              {hasProductsFeature ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Services:</span>
            <span className={hasServicesFeature ? "text-green-600 ml-2" : "text-gray-400 ml-2"}>
              {hasServicesFeature ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Photo Gallery:</span>
            <span className={hasPhotoGalleryFeature ? "text-green-600 ml-2" : "text-gray-400 ml-2"}>
              {hasPhotoGalleryFeature ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessOverviewCard;
