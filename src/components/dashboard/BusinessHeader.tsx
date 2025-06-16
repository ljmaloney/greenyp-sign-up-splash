
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Upload } from 'lucide-react';
import { Producer } from '@/services/accountService';

interface BusinessHeaderProps {
  producer: Producer;
  hasPhotoGalleryFeature: boolean;
  onEditClick: () => void;
  onLogoUpload: () => void;
}

const BusinessHeader = ({ producer, hasPhotoGalleryFeature, onEditClick, onLogoUpload }: BusinessHeaderProps) => {
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
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2 mb-2 flex-1">
        <h1 className="text-2xl text-greenyp-600 font-semibold leading-none tracking-tight">{producer.businessName}</h1>
        <Badge 
          variant={getBadgeVariant(producer.subscriptionType)}
          className={producer.subscriptionType === 'BETA_TESTER' ? 'border-green-500' : ''}
        >
          {getSubscriptionDisplay(producer.subscriptionType)}
        </Badge>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onEditClick}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onLogoUpload}
          disabled={!hasPhotoGalleryFeature}
          className="h-8 w-8 p-0"
          title={hasPhotoGalleryFeature ? "Upload logo" : "Photo gallery feature required"}
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BusinessHeader;
