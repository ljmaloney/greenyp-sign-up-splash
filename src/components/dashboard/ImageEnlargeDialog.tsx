
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { GalleryImage } from './PhotoGalleryContent';

interface ImageEnlargeDialogProps {
  image: GalleryImage;
  isOpen: boolean;
  onClose: () => void;
}

const ImageEnlargeDialog = ({ image, isOpen, onClose }: ImageEnlargeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0">
        <DialogTitle className="sr-only">{image.title}</DialogTitle>
        <div className="relative">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          <div className="p-4 bg-white">
            <h3 className="font-medium text-gray-900">{image.title}</h3>
            {image.description && (
              <p className="text-sm text-gray-700 mt-1">{image.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">Uploaded on {image.uploadDate}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEnlargeDialog;
