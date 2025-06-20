
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FileUploadDropZone from './FileUploadDropZone';
import FilePreviewWithRename from './FilePreviewWithRename';
import LogoDialogFooter from './LogoDialogFooter';

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
        handleFileSelect(file);
      }
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Set default custom name without extension
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
    setCustomFileName(nameWithoutExt || file.name);
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

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setCustomFileName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Business Logo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!selectedFile ? (
            <FileUploadDropZone
              onFileSelect={handleFileSelect}
              dragActive={dragActive}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            />
          ) : (
            <FilePreviewWithRename
              file={selectedFile}
              customFileName={customFileName}
              onCustomFileNameChange={setCustomFileName}
              onRemoveFile={handleRemoveFile}
            />
          )}

          <LogoDialogFooter
            hasExistingLogo={hasExistingLogo || false}
            hasSelectedFile={!!selectedFile}
            isLogoUploading={isLogoUploading || false}
            isLogoDeleting={isLogoDeleting || false}
            onDelete={handleDelete}
            onCancel={handleCancel}
            onUpload={handleUpload}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoUploadDialog;
