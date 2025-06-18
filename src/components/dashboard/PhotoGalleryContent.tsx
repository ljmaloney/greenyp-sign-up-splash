
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAccountData } from '@/hooks/useAccountData';
import GalleryGrid from './GalleryGrid';
import ImageUploadDialog from './ImageUploadDialog';
import ImageEnlargeDialog from './ImageEnlargeDialog';

// Mock gallery images - in a real app, this would come from an API
const mockGalleryImages = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200&h=150&fit=crop',
    title: 'Woman with laptop',
    description: 'Professional woman working on laptop in modern office',
    uploadDate: '2024-01-15'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=150&fit=crop',
    title: 'Gray laptop computer',
    description: 'Modern laptop computer on wooden desk',
    uploadDate: '2024-01-10'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=150&fit=crop',
    title: 'Circuit board',
    description: 'Close-up view of electronic circuit board',
    uploadDate: '2024-01-08'
  }
];

export interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description?: string;
  uploadDate: string;
}

const PhotoGalleryContent = () => {
  const { data: subscriptions } = useSubscriptions();
  const { data: accountData } = useAccountData();
  const [images, setImages] = useState<GalleryImage[]>(mockGalleryImages);
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

  console.log('Gallery feature:', galleryFeature);
  console.log('Max gallery count:', maxGalleryCount);

  const handleImageUpload = (newImages: File[], descriptions: string[]) => {
    // In a real app, you would upload to a server here
    newImages.forEach((file, index) => {
      const newImage: GalleryImage = {
        id: `new-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        title: file.name,
        description: descriptions[index] || '',
        uploadDate: new Date().toISOString().split('T')[0]
      };
      
      setImages(prev => {
        const totalImages = prev.length + 1;
        if (totalImages <= maxGalleryCount) {
          return [...prev, newImage];
        }
        return prev;
      });
    });
  };

  const handleImageReplace = (imageId: string, newFile: File, description: string) => {
    // In a real app, you would upload to a server here
    const newImageData = {
      url: URL.createObjectURL(newFile),
      thumbnail: URL.createObjectURL(newFile),
      title: newFile.name,
      description: description || '',
      uploadDate: new Date().toISOString().split('T')[0]
    };

    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, ...newImageData } : img
    ));
  };

  const handleImageDelete = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const canAddMore = images.length < maxGalleryCount;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Photo Gallery ({images.length}/{maxGalleryCount})</CardTitle>
            <Button 
              onClick={() => setIsUploadDialogOpen(true)}
              disabled={!canAddMore}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Images
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
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Images
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
            setReplacingImage(null);
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
