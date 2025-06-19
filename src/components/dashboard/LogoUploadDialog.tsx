
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Edit2, Trash2 } from 'lucide-react';

interface LogoUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoUpload?: (file: File) => Promise<void>;
  onLogoDelete?: () => Promise<void>;
  isLogoUploading?: boolean;
  isLogoDeleting?: boolean;
  hasExistingLogo?: boolean;
}

const LogoUploadDialog = ({ 
  isOpen, 
  onClose, 
  onLogoUpload, 
  onLogoDelete,
  isLogoUploading,
  isLogoDeleting,
  hasExistingLogo
}: LogoUploadDialogProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customFileName, setCustomFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        // Set default custom name without extension
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
        setCustomFileName(nameWithoutExt || file.name);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Set default custom name without extension
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
      setCustomFileName(nameWithoutExt || file.name);
    }
  };

  const getFileExtension = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
  };

  const createRenamedFile = (originalFile: File, newName: string): File => {
    const extension = getFileExtension(originalFile.name);
    const finalName = newName + extension;
    return new File([originalFile], finalName, { type: originalFile.type });
  };

  const handleUpload = async () => {
    if (selectedFile && onLogoUpload) {
      try {
        const fileToUpload = customFileName.trim() 
          ? createRenamedFile(selectedFile, customFileName.trim())
          : selectedFile;
        
        await onLogoUpload(fileToUpload);
        setSelectedFile(null);
        setCustomFileName('');
        onClose();
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (onLogoDelete) {
      try {
        await onLogoDelete();
        onClose();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setCustomFileName('');
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Business Logo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
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
          ) : (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      <Upload className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setCustomFileName('');
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileName" className="text-sm font-medium flex items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    Rename File (optional)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="fileName"
                      placeholder="Enter new name"
                      value={customFileName}
                      onChange={(e) => setCustomFileName(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 font-mono">
                      {getFileExtension(selectedFile.name)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Final name: {(customFileName.trim() || selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')))}
                    {getFileExtension(selectedFile.name)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            {hasExistingLogo && !selectedFile && (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isLogoDeleting}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {isLogoDeleting ? 'Deleting...' : 'Delete Logo'}
              </Button>
            )}
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isLogoUploading}
            >
              {isLogoUploading ? 'Uploading...' : 'Upload Logo'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoUploadDialog;
