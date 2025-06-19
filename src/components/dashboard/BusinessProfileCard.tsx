
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Edit, Upload, Globe, Calendar, CreditCard } from 'lucide-react';
import { Producer } from '@/services/accountService';
import { useLineOfBusiness } from '@/hooks/useLineOfBusiness';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import BusinessDescription from './BusinessDescription';
import BusinessDetails from './BusinessDetails';
import EditBusinessProfileDialog from './EditBusinessProfileDialog';

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

  const handleLogoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onLogoUpload) {
        onLogoUpload(file);
      }
    };
    input.click();
  };

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

  const getBadgeVariant = (subscriptionType: string) => {
    switch (subscriptionType) {
      case 'ADMIN':
      case 'LIVE_ACTIVE':
        return 'default'; // Green
      case 'BETA_TESTER':
        return 'enterprise'; // Gold with green border
      case 'LIVE_CANCELED':
      case 'LIVE_DISABLED_NONPAYMENT':
        return 'destructive'; // Red
      default:
        return 'default';
    }
  };

  const getSubscriptionDisplay = (subscriptionType: string) => {
    switch (subscriptionType) {
      case 'LIVE_ACTIVE':
        return 'Active';
      case 'LIVE_UNPAID':
        return 'Unpaid';
      case 'LIVE_CANCELED':
        return 'Canceled';
      case 'LIVE_DISABLED_NONPAYMENT':
        return 'Disabled (Non-payment)';
      case 'BETA_TESTER':
        return 'Beta Tester';
      case 'ADMIN':
        return 'Admin';
      default:
        return subscriptionType.replace('_', ' ');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 flex-1">
              {/* Logo or Upload Icon */}
              {hasLogoFeature && (
                <div className="flex-shrink-0">
                  {producer.iconLink ? (
                    <img 
                      src={producer.iconLink} 
                      alt={`${producer.businessName} logo`}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleLogoUpload}
                      disabled={isLogoUploading}
                      className="w-12 h-12 p-0 border-2 border-dashed border-gray-300 hover:border-gray-400"
                      title="Upload logo"
                    >
                      <Upload className="h-5 w-5 text-gray-400" />
                    </Button>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl text-greenyp-600 font-semibold leading-none tracking-tight">
                  {producer.businessName}
                </CardTitle>
                <Badge 
                  variant={getBadgeVariant(producer.subscriptionType)}
                  className={producer.subscriptionType === 'BETA_TESTER' ? 'border-green-500' : ''}
                >
                  {getSubscriptionDisplay(producer.subscriptionType)}
                </Badge>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Feature Status */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm font-medium">Products</div>
                <div className={`text-xs ${hasProductsFeature ? 'text-green-600' : 'text-gray-400'}`}>
                  {hasProductsFeature ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Services</div>
                <div className={`text-xs ${hasServicesFeature ? 'text-green-600' : 'text-gray-400'}`}>
                  {hasServicesFeature ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Photo Gallery</div>
                <div className={`text-xs ${hasPhotoGalleryFeature ? 'text-green-600' : 'text-gray-400'}`}>
                  {hasPhotoGalleryFeature ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>

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
