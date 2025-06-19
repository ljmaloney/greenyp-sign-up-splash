import React, { useState } from 'react';
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Producer } from '@/services/accountService';
import { useLogoDelete } from '@/hooks/useLogoDelete';
import { useToast } from '@/hooks/use-toast';
import LogoUploadButton from './LogoUploadButton';
import LogoUploadDialog from './LogoUploadDialog';

interface BusinessProfileHeaderProps {
  producer: Producer;
  onLogoUpload?: (file: File) => Promise<void>;
  isLogoUploading?: boolean;
  hasLogoFeature: boolean;
  onEditClick: () => void;
}

const BusinessProfileHeader = ({ 
  producer, 
  onLogoUpload, 
  isLogoUploading, 
  hasLogoFeature,
  onEditClick 
}: BusinessProfileHeaderProps) => {
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState(false);
  const { toast } = useToast();
  const logoDeleteMutation = useLogoDelete();

  const handleLogoDelete = async () => {
    try {
      await logoDeleteMutation.mutateAsync();
      toast({
        title: "Logo Deleted",
        description: "Your business logo has been successfully deleted",
      });
    } catch (error) {
      console.error('Error deleting logo:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete logo. Please try again.",
        variant: "destructive",
      });
    }
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
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 flex-1">
          <LogoUploadButton 
            onLogoUpload={onLogoUpload}
            isLogoUploading={isLogoUploading}
            hasLogoFeature={hasLogoFeature}
            producer={producer}
            onUploadClick={() => setIsLogoDialogOpen(true)}
          />
          
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
          onClick={onEditClick}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <LogoUploadDialog
        isOpen={isLogoDialogOpen}
        onClose={() => setIsLogoDialogOpen(false)}
        onLogoUpload={onLogoUpload}
        onLogoDelete={handleLogoDelete}
        isLogoUploading={isLogoUploading}
        isLogoDeleting={logoDeleteMutation.isPending}
        hasExistingLogo={!!producer.iconLink}
      />
    </>
  );
};

export default BusinessProfileHeader;
