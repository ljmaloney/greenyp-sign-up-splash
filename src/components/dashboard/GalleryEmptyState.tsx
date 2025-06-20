
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';

interface GalleryEmptyStateProps {
  onAddImages: () => void;
  isUploading: boolean;
}

const GalleryEmptyState = ({ onAddImages, isUploading }: GalleryEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
      <p className="text-gray-500 mb-4">Upload your first images to showcase your business</p>
      <Button 
        onClick={onAddImages}
        disabled={isUploading}
      >
        <Plus className="h-4 w-4 mr-2" />
        {isUploading ? 'Uploading...' : 'Add Images'}
      </Button>
    </div>
  );
};

export default GalleryEmptyState;
