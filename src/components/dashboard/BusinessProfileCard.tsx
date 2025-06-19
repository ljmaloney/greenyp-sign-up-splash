
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Edit, Upload, Globe, Calendar, CreditCard } from 'lucide-react';
import { Producer } from '@/services/accountService';
import { useLineOfBusiness } from '@/hooks/useLineOfBusiness';
import BusinessDescription from './BusinessDescription';
import BusinessHeader from './BusinessHeader';
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

  // Create businessData object for the edit dialog
  const businessData = {
    businessName: producer.businessName || '',
    contactName: '', // This would need to come from contacts
    email: '', // This would need to come from contacts
    phone: '', // This would need to come from contacts
    address: '', // This would need to come from primary location
    website: producer.website || '',
    description: producer.narrative || '',
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center gap-2 text-greenyp-600">
              <Building2 className="h-5 w-5" />
              Business Profile
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              {onLogoUpload && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogoUpload}
                  disabled={isLogoUploading || !hasPhotoGalleryFeature}
                  className="h-8 w-8 p-0"
                  title={hasPhotoGalleryFeature ? "Upload logo" : "Photo gallery feature required"}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <BusinessHeader 
              producer={producer}
              hasPhotoGalleryFeature={hasPhotoGalleryFeature}
              onEditClick={() => setIsEditDialogOpen(true)}
              onLogoUpload={handleLogoUpload}
            />

            {producer.narrative && (
              <BusinessDescription narrative={producer.narrative} />
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
