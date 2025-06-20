
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { GalleryImage } from './PhotoGalleryContent';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
  onImageDelete: (imageId: string) => void;
  isDeleting?: boolean;
}

const GalleryGrid = ({ images, onImageClick, onImageDelete, isDeleting }: GalleryGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative group">
          <div 
            className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => onImageClick(image)}
          >
            <img
              src={image.thumbnail}
              alt={image.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          
          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex gap-1">
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageDelete(image.id);
                }}
                disabled={isDeleting}
                className="h-8 w-8 p-0"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Image info */}
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-900 truncate">{image.title}</p>
            {image.description && (
              <p className="text-xs text-gray-500 truncate">{image.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
