
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, Image as ImageIcon, Edit2 } from 'lucide-react';
import { GalleryImage } from './PhotoGalleryContent';

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], descriptions: string[]) => void;
  maxImages: number;
  isReplacing: boolean;
  replacingImage?: GalleryImage;
}

interface FileWithDescription {
  file: File;
  description: string;
  customName: string;
}

const ImageUploadDialog = ({
  isOpen,
  onClose,
  onUpload,
  maxImages,
  isReplacing,
  replacingImage
}: ImageUploadDialogProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithDescription[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileExtension = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
  };

  const getFileNameWithoutExtension = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    const filesWithDescriptions = validFiles.map(file => ({
      file,
      description: '',
      customName: getFileNameWithoutExtension(file.name)
    }));
    
    if (isReplacing) {
      setSelectedFiles(filesWithDescriptions.slice(0, 1));
    } else {
      setSelectedFiles(prev => [...prev, ...filesWithDescriptions].slice(0, maxImages));
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

  const updateDescription = (index: number, description: string) => {
    setSelectedFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, description } : item
    ));
  };

  const updateCustomName = (index: number, customName: string) => {
    setSelectedFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, customName } : item
    ));
  };

  const createRenamedFile = (originalFile: File, newName: string): File => {
    const extension = getFileExtension(originalFile.name);
    const finalName = newName + extension;
    return new File([originalFile], finalName, { type: originalFile.type });
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      const files = selectedFiles.map(item => 
        item.customName.trim() 
          ? createRenamedFile(item.file, item.customName.trim())
          : item.file
      );
      const descriptions = selectedFiles.map(item => item.description);
      onUpload(files, descriptions);
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
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
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

          {/* Selected files preview with descriptions and renaming */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Selected Images:</h4>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {selectedFiles.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700 truncate max-w-48">
                          {item.file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(item.file.size / 1024 / 1024).toFixed(1)}MB)
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
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`fileName-${index}`} className="text-sm font-medium flex items-center gap-2">
                          <Edit2 className="h-4 w-4" />
                          Rename File (optional)
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`fileName-${index}`}
                            placeholder="Enter new name"
                            value={item.customName}
                            onChange={(e) => updateCustomName(index, e.target.value)}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 font-mono">
                            {getFileExtension(item.file.name)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Final name: {item.customName.trim() || getFileNameWithoutExtension(item.file.name)}
                          {getFileExtension(item.file.name)}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`description-${index}`} className="text-sm font-medium">
                          Description (optional)
                        </Label>
                        <Textarea
                          id={`description-${index}`}
                          placeholder="Add a description for this image..."
                          value={item.description}
                          onChange={(e) => updateDescription(index, e.target.value)}
                          className="resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
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
