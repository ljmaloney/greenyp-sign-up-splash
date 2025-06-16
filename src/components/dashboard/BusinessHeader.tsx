
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
  return (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl text-greenyp-600 font-semibold leading-none tracking-tight">{producer.businessName}</h1>
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
      <Badge variant={producer.subscriptionType === 'LIVE_UNPAID' ? 'destructive' : 'default'}>
        {producer.subscriptionType.replace('_', ' ')}
      </Badge>
    </div>
  );
};

export default BusinessHeader;
