
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Camera } from 'lucide-react';
import { useProfileGalleryImages } from '@/hooks/useProfileGalleryImages';
import { ProfileData } from '@/types/profile';

interface ProfileGalleryProps {
  profile: ProfileData;
}

const ProfileGallery = ({ profile }: ProfileGalleryProps) => {
  const { data: galleryImages, isLoading, error } = useProfileGalleryImages(profile.producerId);

  // Don't render if no images or if there's an error
  if (isLoading || error || !galleryImages || galleryImages.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="w-5 h-5 mr-2 text-greenyp-600" />
          Photo Gallery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {galleryImages.map((image, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.description || image.imageName}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    loading="lazy"
                  />
                  {image.description && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                      <p className="text-sm truncate">{image.description}</p>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default ProfileGallery;
