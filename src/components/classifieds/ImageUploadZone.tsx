
import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadZoneProps {
  maxImages: number;
  onFileSelect: (files: FileList | null) => void;
}

const ImageUploadZone = ({ maxImages, onFileSelect }: ImageUploadZoneProps) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('fileInput')?.click()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
    >
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-2">
        Click to upload or drag and drop images here
      </p>
      <p className="text-sm text-gray-500">
        Up to {maxImages} images, 5MB max each
      </p>
      <input
        id="fileInput"
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => onFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploadZone;
