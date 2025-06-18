
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { GalleryImage } from './PhotoGalleryContent';

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  maxImages: number;
  isReplacing: boolean;
  replacingImage?: GalleryImage;
}

const ImageUploadDialog = ({
  isOpen,
  onClose,
  onUpload,
  maxImages,
  isReplacing,
  replacingImage
}: ImageUploadDialogProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (isReplacing) {
      setSelectedFiles(validFiles.slice(0, 1));
    } else {
      setSelectedFiles(prev => [...prev, ...validFiles].slice(0, maxImages));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
      setSelectedFiles([]);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isReplacing ? `Replace ${replacingImage?.title}` : 'Upload Images'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop images here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {isReplacing 
                ? 'Select 1 image to replace the current one'
                : `You can upload up to ${maxImages} images`
              }
            </p>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple={!isReplacing}
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Selected files preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Selected Images:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700 truncate max-w-48">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(1)}MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={selectedFiles.length === 0}
          >
            {isReplacing ? 'Replace Image' : `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
