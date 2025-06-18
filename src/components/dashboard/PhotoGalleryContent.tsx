
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAccountData } from '@/hooks/useAccountData';
import { useGalleryImages, useUploadGalleryImage } from '@/hooks/useGalleryImages';
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
  const { data: subscriptions } = useSubscriptions();
  const { data: accountData } = useAccountData();
  const { data: galleryImages, isLoading: imagesLoading } = useGalleryImages();
  const uploadImageMutation = useUploadGalleryImage();
  
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<GalleryImage | null>(null);
  const [replacingImage, setReplacingImage] = useState<GalleryImage | null>(null);

  // Get current subscription ID from account data
  const currentSubscriptionId = accountData?.producer?.subscriptions?.[0]?.subscriptionId;
  
  // Find the current subscription details
  const currentSubscription = subscriptions?.find(sub => sub.subscriptionId === currentSubscriptionId);
  
  // Get gallery feature configuration
  const galleryFeature = currentSubscription?.features.find(feature => feature.feature === 'gallery');
  const maxGalleryCount = galleryFeature?.configMap?.maxGalleryCount || 0;

  // Convert API images to display format
  const images: GalleryImage[] = galleryImages?.map((img, index) => ({
    id: `api-${index}`,
    url: img.url,
    thumbnail: img.url,
    title: img.imageName,
    description: img.description,
    uploadDate: new Date().toISOString().split('T')[0] // API doesn't provide upload date
  })) || [];

  console.log('Gallery feature:', galleryFeature);
  console.log('Max gallery count:', maxGalleryCount);
  console.log('Current images:', images);

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

  const handleImageReplace = async (imageId: string, newFile: File, description: string) => {
    try {
      await uploadImageMutation.mutateAsync({ file: newFile, description });
      
      toast({
        title: "Image Replaced",
        description: "Image has been successfully replaced",
      });
      
      setReplacingImage(null);
    } catch (error) {
      console.error('Error replacing image:', error);
      toast({
        title: "Replace Failed",
        description: "Failed to replace image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageDelete = (imageId: string) => {
    // TODO: Implement delete functionality when API endpoint is available
    console.log('Delete image:', imageId);
    toast({
      title: "Delete Not Available",
      description: "Image deletion is not yet implemented",
      variant: "destructive",
    });
  };

  const canAddMore = images.length < maxGalleryCount;

  if (imagesLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Photo Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">Loading images...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Photo Gallery ({images.length}/{maxGalleryCount})</CardTitle>
            <Button 
              onClick={() => setIsUploadDialogOpen(true)}
              disabled={!canAddMore || uploadImageMutation.isPending}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {uploadImageMutation.isPending ? 'Uploading...' : 'Add Images'}
            </Button>
          </div>
          {maxGalleryCount === 0 && (
            <p className="text-sm text-gray-500">
              Photo gallery is not available with your current subscription. 
              <a href="/dashboard/upgrade" className="text-blue-600 hover:underline ml-1">
                Upgrade your plan
              </a> to enable this feature.
            </p>
          )}
        </CardHeader>
        {maxGalleryCount > 0 && (
          <CardContent>
            {images.length === 0 ? (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
                <p className="text-gray-500 mb-4">Upload your first images to showcase your business</p>
                <Button 
                  onClick={() => setIsUploadDialogOpen(true)}
                  disabled={uploadImageMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {uploadImageMutation.isPending ? 'Uploading...' : 'Add Images'}
                </Button>
              </div>
            ) : (
              <GalleryGrid
                images={images}
                onImageClick={setEnlargedImage}
                onImageDelete={handleImageDelete}
                onImageReplace={setReplacingImage}
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

      {/* Replace Dialog */}
      {replacingImage && (
        <ImageUploadDialog
          isOpen={true}
          onClose={() => setReplacingImage(null)}
          onUpload={(files, descriptions) => {
            if (files[0]) {
              handleImageReplace(replacingImage.id, files[0], descriptions[0]);
            }
          }}
          maxImages={1}
          isReplacing={true}
          replacingImage={replacingImage}
        />
      )}

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
};

export default PhotoGalleryContent;
