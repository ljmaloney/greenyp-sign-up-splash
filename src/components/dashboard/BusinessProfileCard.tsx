
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Producer } from '@/services/accountService';
import { useLineOfBusiness } from '@/hooks/useLineOfBusiness';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import BusinessDescription from './BusinessDescription';
import BusinessDetails from './BusinessDetails';
import EditBusinessProfileDialog from './EditBusinessProfileDialog';
import BusinessProfileHeader from './BusinessProfileHeader';
import FeatureStatusGrid from './FeatureStatusGrid';

interface BusinessProfileCardProps {
  producer: Producer;
  onLogoUpload?: (file: File) => Promise<void>;
  isLogoUploading?: boolean;
  hasPhotoGalleryFeature: boolean;
}

const BusinessProfileCard = ({ 
  producer, 
  onLogoUpload, 
  isLogoUploading, 
  hasPhotoGalleryFeature 
}: BusinessProfileCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: lineOfBusinessData } = useLineOfBusiness();
  const { data: subscriptions } = useSubscriptions();

  // Find the line of business name - using correct property name
  const lineOfBusinessName = lineOfBusinessData?.find(
    lob => lob.lineOfBusinessId === producer.lineOfBusinessId
  )?.lineOfBusinessName || 'Unknown';

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

  // Create businessData object for the edit dialog
  const businessData = {
    businessName: producer.businessName || '',
    contactName: '', // This would need to come from contacts
    email: '', // This would need to come from contacts
    phone: '', // This would need to come from contacts
    address: '', // This would need to come from primary location
    website: producer.websiteUrl || '',
    description: producer.narrative || '',
  };

  return (
    <>
      <Card>
        <CardHeader>
          <BusinessProfileHeader 
            producer={producer}
            onLogoUpload={onLogoUpload}
            isLogoUploading={isLogoUploading}
            hasLogoFeature={hasLogoFeature}
            onEditClick={() => setIsEditDialogOpen(true)}
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FeatureStatusGrid 
              hasProductsFeature={hasProductsFeature}
              hasServicesFeature={hasServicesFeature}
              hasPhotoGalleryFeature={hasPhotoGalleryFeature}
            />

            {producer.narrative && (
              <BusinessDescription narrative={producer.narrative} maxLength={80} />
            )}

            <BusinessDetails 
              producer={producer}
              lineOfBusinessName={lineOfBusinessName}
            />
          </div>
        </CardContent>
      </Card>

      <EditBusinessProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        businessData={businessData}
      />
    </>
  );
};

export default BusinessProfileCard;
