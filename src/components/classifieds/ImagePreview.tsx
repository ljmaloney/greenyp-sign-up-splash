
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  images: File[];
  imageDescriptions: string[];
  onRemoveImage: (index: number) => void;
  onUpdateDescription: (index: number, description: string) => void;
}

const ImagePreview = ({ 
  images, 
  imageDescriptions, 
  onRemoveImage, 
  onUpdateDescription 
}: ImagePreviewProps) => {
  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      {images.map((file, index) => (
        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
          <div className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              onClick={() => onRemoveImage(index)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium mb-2">{file.name}</div>
            <div>
              <Label htmlFor={`desc-${index}`}>Description (optional)</Label>
              <Input
                id={`desc-${index}`}
                value={imageDescriptions[index]}
                onChange={(e) => onUpdateDescription(index, e.target.value)}
                placeholder="Enter image description"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImagePreview;
