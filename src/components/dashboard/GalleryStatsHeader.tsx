
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface GalleryStatsHeaderProps {
  imageCount: number;
  maxGalleryCount: number;
  onAddImages: () => void;
  canAddMore: boolean;
  isUploading: boolean;
  hasGalleryFeature: boolean;
}

const GalleryStatsHeader = ({
  imageCount,
  maxGalleryCount,
  onAddImages,
  canAddMore,
  isUploading,
  hasGalleryFeature
}: GalleryStatsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle>Photo Gallery ({imageCount}/{maxGalleryCount})</CardTitle>
      {hasGalleryFeature && (
        <Button 
          onClick={onAddImages}
          disabled={!canAddMore || isUploading}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Add Images'}
        </Button>
      )}
    </div>
  );
};

export default GalleryStatsHeader;
