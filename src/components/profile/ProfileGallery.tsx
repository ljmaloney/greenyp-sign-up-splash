
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useProfileGalleryImages } from '@/hooks/useProfileGalleryImages';
import { Images } from 'lucide-react';
import type { ProducerProfile } from '@/types/profile';

interface ProfileGalleryProps {
  profile: ProducerProfile;
}

const ProfileGallery = ({ profile }: ProfileGalleryProps) => {
  const { data: subscriptions } = useSubscriptions();
  const { data: galleryImages } = useProfileGalleryImages(profile.producerId);

  // Check if any of the profile's subscriptions have gallery feature
  const hasGalleryFeature = profile.subscriptionIds.some(subscriptionId => {
    const subscription = subscriptions?.find(sub => sub.subscriptionId === subscriptionId);
    return subscription?.features.some(feature => feature.feature === 'gallery');
  });

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
        {galleryImages && galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.imageName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No images available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileGallery;
