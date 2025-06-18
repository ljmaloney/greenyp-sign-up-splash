
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCcw, ZoomIn } from 'lucide-react';
import { GalleryImage } from './PhotoGalleryContent';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
  onImageDelete: (imageId: string) => void;
  onImageReplace: (image: GalleryImage) => void;
}

const GalleryGrid = ({ images, onImageClick, onImageDelete, onImageReplace }: GalleryGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative group">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={image.thumbnail}
              alt={image.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            
            {/* Overlay with buttons */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onImageClick(image)}
                  className="h-8 w-8 p-0"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onImageReplace(image)}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onImageDelete(image.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Image info */}
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-900 truncate">{image.title}</p>
            <p className="text-xs text-gray-500">{image.uploadDate}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
