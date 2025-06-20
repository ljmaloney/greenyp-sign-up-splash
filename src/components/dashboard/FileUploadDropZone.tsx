
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadDropZoneProps {
  onFileSelect: (file: File) => void;
  dragActive: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const FileUploadDropZone = ({
  onFileSelect,
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop
}: FileUploadDropZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-lg font-medium text-gray-700 mb-2">
        Drop your logo here
      </p>
      <p className="text-sm text-gray-500 mb-4">
        or click to browse files
      </p>
      <Button 
        variant="outline" 
        onClick={() => fileInputRef.current?.click()}
        className="mx-auto"
      >
        Select File
      </Button>
      <p className="text-xs text-gray-400 mt-2">
        PNG, JPG up to 5MB
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default FileUploadDropZone;
