
import React, { useCallback, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GalleryImage } from './PhotoGalleryContent';

interface ImageEnlargeDialogProps {
  image: GalleryImage | null;
  images: GalleryImage[];
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const ImageEnlargeDialog = ({
  image,
  images,
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: ImageEnlargeDialogProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (hasPrev) onPrev();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    },
    [isOpen, hasNext, hasPrev, onNext, onPrev, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] p-0 bg-black/90 border-0">
        <div className="relative w-full h-full flex flex-col">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 focus:ring-2 focus:ring-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>

          {/* Navigation buttons */}
          {hasPrev && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'absolute left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/50 text-white',
                'hover:bg-black/70 focus:ring-2 focus:ring-white',
                'transition-all duration-200 transform hover:scale-110'
              )}
              onClick={onPrev}
            >
              <ChevronLeft className="h-8 w-8" />
              <span className="sr-only">Previous image</span>
            </Button>
          )}

          {hasNext && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/50 text-white',
                'hover:bg-black/70 focus:ring-2 focus:ring-white',
                'transition-all duration-200 transform hover:scale-110'
              )}
              onClick={onNext}
            >
              <ChevronRight className="h-8 w-8" />
              <span className="sr-only">Next image</span>
            </Button>
          )}

          {/* Image counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
            {images.findIndex((img) => img.id === image.id) + 1} / {images.length}
          </div>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={image.url}
              alt={image.title}
              className="max-w-full max-h-[calc(90vh-100px)] object-contain"
              draggable={false}
            />
          </div>

          {/* Image info */}
          {(image.title || image.description) && (
            <div className="p-4 bg-gray-900 text-white border-t border-gray-800">
              {image.title && (
                <h3 className="font-medium text-lg mb-1">{image.title}</h3>
              )}
              {image.description && (
                <p className="text-gray-300 text-sm">{image.description}</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEnlargeDialog;
