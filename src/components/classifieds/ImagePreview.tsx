
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Edit2 } from 'lucide-react';

interface FileWithCustomName {
  file: File;
  customName: string;
}

interface ImagePreviewProps {
  filesWithNames: FileWithCustomName[];
  imageDescriptions: string[];
  onRemoveImage: (index: number) => void;
  onUpdateDescription: (index: number, description: string) => void;
  onUpdateFileName: (index: number, customName: string) => void;
}

const ImagePreview = ({ 
  filesWithNames, 
  imageDescriptions, 
  onRemoveImage, 
  onUpdateDescription,
  onUpdateFileName
}: ImagePreviewProps) => {
  if (filesWithNames.length === 0) return null;

  const getExtensionFromMimeType = (mimeType: string) => {
    const mimeToExtension: { [key: string]: string } = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/bmp': '.bmp',
      'image/tiff': '.tiff',
      'image/svg+xml': '.svg'
    };
    
    return mimeToExtension[mimeType.toLowerCase()] || '.jpg';
  };

  return (
    <div className="space-y-4">
      {filesWithNames.map(({ file, customName }, index) => (
        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
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
          <div className="flex-1 space-y-4">
            <div className="text-sm font-medium text-gray-600">
              Original: {file.name}
            </div>
            
            {/* File Name Editor */}
            <div className="space-y-2">
              <Label htmlFor={`filename-${index}`} className="text-sm font-medium flex items-center gap-2">
                <Edit2 className="h-4 w-4" />
                File Name (optional)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`filename-${index}`}
                  value={customName}
                  onChange={(e) => onUpdateFileName(index, e.target.value)}
                  placeholder="Enter custom file name"
                  className="flex-1"
                  required={false}
                  autoComplete="off"
                />
                <span className="text-sm text-gray-500 font-mono">
                  {getExtensionFromMimeType(file.type)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Final name: {customName.trim() || file.name.substring(0, file.name.lastIndexOf('.')) || file.name}
                {getExtensionFromMimeType(file.type)}
              </p>
            </div>

            {/* Description Editor */}
            <div className="space-y-2">
              <Label htmlFor={`desc-${index}`} className="text-sm font-medium">
                Description (optional)
              </Label>
              <Input
                id={`desc-${index}`}
                value={imageDescriptions[index]}
                onChange={(e) => onUpdateDescription(index, e.target.value)}
                placeholder="Enter image description"
                required={false}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImagePreview;
