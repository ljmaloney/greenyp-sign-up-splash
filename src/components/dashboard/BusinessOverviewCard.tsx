
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Producer } from '@/services/accountService';
import { useLineOfBusiness } from '@/hooks/useLineOfBusiness';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import EditBusinessInfoDialog from './EditBusinessInfoDialog';
import BusinessHeader from './BusinessHeader';
import BusinessDescription from './BusinessDescription';
import BusinessDetails from './BusinessDetails';

interface BusinessOverviewCardProps {
  producer: Producer;
}

const BusinessOverviewCard = ({ producer }: BusinessOverviewCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: lineOfBusinessData, isLoading: lobLoading } = useLineOfBusiness();
  const { data: subscriptions } = useSubscriptions();

  const getLineOfBusinessName = (lineOfBusinessId: string) => {
    console.log('🔍 Looking for lineOfBusinessId:', lineOfBusinessId);
    console.log('📊 Available line of business data:', lineOfBusinessData);
    
    if (!lineOfBusinessData || !lineOfBusinessId) {
      console.log('❌ No line of business data or ID available');
      return lobLoading ? 'Loading...' : 'Not specified';
    }
    
    const lob = lineOfBusinessData.find(item => item.lineOfBusinessId === lineOfBusinessId);
    console.log('✅ Found line of business:', lob);
    
    return lob?.lineOfBusinessName || 'Unknown';
  };

  // Find the TOP_LEVEL subscription from the producer's subscriptions
  const topLevelSubscription = producer.subscriptions?.find(sub => sub.subscriptionType === 'TOP_LEVEL');
  const currentSubscriptionId = topLevelSubscription?.subscriptionId;
  
  console.log('🔍 Producer subscriptions:', producer.subscriptions);
  console.log('📋 Found TOP_LEVEL subscription:', topLevelSubscription);
  console.log('🆔 Current subscription ID:', currentSubscriptionId);

  // Check if subscription includes Photo gallery feature
  const currentSubscription = subscriptions?.find(sub => sub.subscriptionId === currentSubscriptionId);
  const hasPhotoGalleryFeature = currentSubscription?.features.some(feature => 
    feature.toLowerCase().includes('photo gallery')) || false;

  console.log('🎯 Current subscription from reference data:', currentSubscription);
  console.log('📸 Has Photo Gallery Feature:', hasPhotoGalleryFeature);

  const businessData = {
    businessName: producer.businessName,
    description: producer.narrative,
    websiteUrl: producer.websiteUrl,
    producerId: producer.producerId,
    lineOfBusinessId: producer.lineOfBusinessId,
  };

  const handleLogoUpload = () => {
    // TODO: Implement logo upload functionality
    console.log('Logo upload clicked');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <BusinessHeader
            producer={producer}
            hasPhotoGalleryFeature={hasPhotoGalleryFeature}
            onEditClick={() => setIsEditDialogOpen(true)}
            onLogoUpload={handleLogoUpload}
          />
          
          <BusinessDescription narrative={producer.narrative} />
        </CardHeader>
        <CardContent>
          <BusinessDetails
            producer={producer}
            lineOfBusinessName={getLineOfBusinessName(producer.lineOfBusinessId)}
          />
        </CardContent>
      </Card>

      <EditBusinessInfoDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        businessData={businessData}
      />
    </>
  );
};

export default BusinessOverviewCard;
