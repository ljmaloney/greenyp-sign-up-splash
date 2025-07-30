
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Producer } from '@/services/accountService';
import BusinessDescription from './BusinessDescription';
import BusinessDetails from './BusinessDetails';
import EditBusinessProfileDialog from './EditBusinessProfileDialog';
import BusinessProfileHeader from './BusinessProfileHeader';
import FeatureStatusGrid from './FeatureStatusGrid';
import BusinessDataProcessor from './BusinessDataProcessor';
import FeatureChecker from './FeatureChecker';

interface BusinessProfileCardProps {
  producer: Producer;
  onLogoUpload?: (file: File) => Promise<void>;
  isLogoUploading?: boolean;
  hasPhotoGalleryFeature: boolean;
  onProfileUpdateSuccess?: () => void;
}

const BusinessProfileCard = ({ 
  producer, 
  onLogoUpload, 
  isLogoUploading, 
  hasPhotoGalleryFeature,
  onProfileUpdateSuccess 
}: BusinessProfileCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <BusinessDataProcessor producer={producer}>
      {({ businessData, lineOfBusinessName, lineOfBusinessOptions }) => (
        <FeatureChecker producer={producer} hasPhotoGalleryFeature={hasPhotoGalleryFeature}>
          {({ hasProductsFeature, hasServicesFeature, hasLogoFeature, hasPhotoGalleryFeature: photoGalleryFeature }) => (
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
                    {producer.narrative && (
                      <BusinessDescription narrative={producer.narrative} maxLength={80} />
                    )}

                    <BusinessDetails 
                      producer={producer}
                      lineOfBusinessName={lineOfBusinessName}
                    />

                    <FeatureStatusGrid 
                      hasProductsFeature={hasProductsFeature}
                      hasServicesFeature={hasServicesFeature}
                      hasPhotoGalleryFeature={photoGalleryFeature}
                    />
                  </div>
                </CardContent>
              </Card>

              <EditBusinessProfileDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                producer={producer}
                lineOfBusinessOptions={lineOfBusinessOptions}
                onSuccess={onProfileUpdateSuccess}
              />
            </>
          )}
        </FeatureChecker>
      )}
    </BusinessDataProcessor>
  );
};

export default BusinessProfileCard;
