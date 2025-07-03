
import React from 'react';

interface ImageUploadHeaderProps {
  maxImages: number;
}

const ImageUploadHeader = ({ maxImages }: ImageUploadHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Images</h1>
      <p className="text-gray-600">Add up to {maxImages} images to your classified ad</p>
    </div>
  );
};

export default ImageUploadHeader;
