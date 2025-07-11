
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useGalleryImages, useUploadGalleryImage, useDeleteGalleryImage } from '@/hooks/useGalleryImages';
import GalleryFeatureChecker from './GalleryFeatureChecker';
import GalleryStatsHeader from './GalleryStatsHeader';
import GalleryEmptyState from './GalleryEmptyState';
import GalleryLoadingState from './GalleryLoadingState';
import GalleryUpgradePrompt from './GalleryUpgradePrompt';
import GalleryGrid from './GalleryGrid';
import ImageUploadDialog from './ImageUploadDialog';
import ImageEnlargeDialog from './ImageEnlargeDialog';

export interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description?: string;
  uploadDate: string;
}

const PhotoGalleryContent = () => {
  const { toast } = useToast();
  const { data: galleryImages, isLoading: imagesLoading } = useGalleryImages();
  const uploadImageMutation = useUploadGalleryImage();
  const deleteImageMutation = useDeleteGalleryImage();
  
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<GalleryImage | null>(null);

  const handleImageUpload = async (newImages: File[], descriptions: string[]) => {
    try {
      // Upload images one by one
      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];
        const description = descriptions[i] || '';
        
        await uploadImageMutation.mutateAsync({ file, description });
      }
      
      toast({
        title: "Images Uploaded",
        description: `Successfully uploaded ${newImages.length} image${newImages.length !== 1 ? 's' : ''}`,
      });
      
      setIsUploadDialogOpen(false);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageDelete = async (imageId: string, images: GalleryImage[]) => {
    // Find the image to get its filename
    const imageToDelete = images.find(img => img.id === imageId);
    if (!imageToDelete) {
      toast({
        title: "Delete Failed",
        description: "Image not found",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteImageMutation.mutateAsync(imageToDelete.title);
      toast({
        title: "Image Deleted",
        description: "Image has been successfully deleted",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <GalleryFeatureChecker>
      {({ maxGalleryCount, hasGalleryFeature, isLoading: featureLoading }) => {
        // Convert API images to display format
        const images: GalleryImage[] = galleryImages?.map((img, index) => ({
          id: `api-${index}`,
          url: img.url,
          thumbnail: img.url,
          title: img.imageName,
          description: img.description,
          uploadDate: new Date().toISOString().split('T')[0] // API doesn't provide upload date
        })) || [];

        const canAddMore = images.length < maxGalleryCount;

        if (imagesLoading || featureLoading) {
          return <GalleryLoadingState />;
        }

        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <GalleryStatsHeader
                  imageCount={images.length}
                  maxGalleryCount={maxGalleryCount}
                  onAddImages={() => setIsUploadDialogOpen(true)}
                  canAddMore={canAddMore}
                  isUploading={uploadImageMutation.isPending}
                  hasGalleryFeature={hasGalleryFeature}
                />
                {!hasGalleryFeature && <GalleryUpgradePrompt />}
              </CardHeader>
              {hasGalleryFeature && (
                <CardContent>
                  {images.length === 0 ? (
                    <GalleryEmptyState
                      onAddImages={() => setIsUploadDialogOpen(true)}
                      isUploading={uploadImageMutation.isPending}
                    />
                  ) : (
                    <GalleryGrid
                      images={images}
                      onImageClick={setEnlargedImage}
                      onImageDelete={(imageId) => handleImageDelete(imageId, images)}
                      isDeleting={deleteImageMutation.isPending}
                    />
                  )}
                </CardContent>
              )}
            </Card>

            {/* Upload Dialog */}
            <ImageUploadDialog
              isOpen={isUploadDialogOpen}
              onClose={() => setIsUploadDialogOpen(false)}
              onUpload={handleImageUpload}
              maxImages={maxGalleryCount - images.length}
              isReplacing={false}
            />

            {/* Enlarge Dialog */}
            {enlargedImage && (
              <ImageEnlargeDialog
                image={enlargedImage}
                isOpen={true}
                onClose={() => setEnlargedImage(null)}
              />
            )}
          </div>
        );
      }}
    </GalleryFeatureChecker>
  );
};

export default PhotoGalleryContent;
