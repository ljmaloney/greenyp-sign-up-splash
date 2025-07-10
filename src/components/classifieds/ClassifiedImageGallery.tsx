
import React from 'react';

interface ClassifiedImageGalleryProps {
  images: string[];
  title: string;
}

const ClassifiedImageGallery = ({ images, title }: ClassifiedImageGalleryProps) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Photos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={image} 
              alt={`${title} - Image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => window.open(image, '_blank')}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassifiedImageGallery;
