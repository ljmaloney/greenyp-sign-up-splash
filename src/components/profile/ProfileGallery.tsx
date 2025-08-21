
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useProfileGalleryImages } from '@/hooks/useProfileGalleryImages';
import { Images, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProducerProfile } from '@/types/profile';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

// Helper function to extract display info from image
const getImageDisplayInfo = (image: any) => {
  // Extract filename from URL if imageName is null
  const fileName = image.imageName || 
    (image.url ? image.url.split('/').pop()?.split('?')[0] || 'Image' : 'Image');
  
  // Use description if available, otherwise use the filename
  const description = image.description || fileName;
  
  return { fileName, description };
};

interface ProfileGalleryProps {
  profile: ProducerProfile;
}

const ProfileGallery = ({ profile }: ProfileGalleryProps) => {
  const { data: subscriptions } = useSubscriptions();
  const { data: galleryImages = [] } = useProfileGalleryImages(profile.producerId);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Check if any of the profile's subscriptions have gallery feature
  const hasGalleryFeature = profile.subscriptionIds.some(subscriptionId => {
    const subscription = subscriptions?.find(sub => sub.subscriptionId === subscriptionId);
    return subscription?.features.some(feature => feature.feature === 'gallery');
  });

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    const newIndex = direction === 'next' 
      ? (selectedImageIndex + 1) % galleryImages.length
      : (selectedImageIndex - 1 + galleryImages.length) % galleryImages.length;
    
    setSelectedImageIndex(newIndex);
  };

  if (!hasGalleryFeature) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Images className="w-5 h-5 text-greenyp-600" />
          Photo Gallery
        </CardTitle>
      </CardHeader>
      <CardContent>
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image.url}
                  alt={getImageDisplayInfo(image).fileName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No images available</p>
        )}

        {/* Image Viewer Modal */}
        <Dialog open={selectedImageIndex !== null} onOpenChange={closeModal}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-0">
            <DialogTitle className="sr-only">Image Viewer</DialogTitle>
            {selectedImageIndex !== null && galleryImages[selectedImageIndex] && (
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Navigation Buttons */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('prev');
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('next');
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Main Image with Border */}
                <div className="flex flex-col items-center">
                  <div className="bg-white p-2 rounded-lg shadow-lg mb-2">
                    <img
                      src={galleryImages[selectedImageIndex].url}
                      alt={getImageDisplayInfo(galleryImages[selectedImageIndex]).fileName}
                      className="max-h-[70vh] max-w-full object-contain"
                    />
                  </div>
                  
                  {/* Image Description */}
                  {getImageDisplayInfo(galleryImages[selectedImageIndex]).description && (
                    <div className="w-full bg-white/90 text-gray-800 p-3 rounded-lg mt-2">
                      <p className="text-sm text-center">
                        {getImageDisplayInfo(galleryImages[selectedImageIndex]).description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProfileGallery;
