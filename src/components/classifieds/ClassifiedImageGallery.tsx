
import React, { useState } from 'react';
import PhotoGalleryDialog from './PhotoGalleryDialog';

interface ClassifiedImageGalleryProps {
  images: string[];
  title: string;
}

const ClassifiedImageGallery = ({ images, title }: ClassifiedImageGalleryProps) => {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowGallery(true);
  };

  return (
    <>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Photos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={image} 
                alt={`${title} - Image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <PhotoGalleryDialog
        images={images}
        title={title}
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        initialIndex={selectedImageIndex}
      />
    </>
  );
};

export default ClassifiedImageGallery;
