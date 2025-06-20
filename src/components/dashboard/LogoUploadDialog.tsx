
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FileUploadDropZone from './FileUploadDropZone';
import FilePreviewWithRename from './FilePreviewWithRename';
import LogoDialogFooter from './LogoDialogFooter';
import { useLogoUploadDialog } from '@/hooks/useLogoUploadDialog';

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
  const {
    dragActive,
    selectedFile,
    customFileName,
    setCustomFileName,
    handleDrag,
    handleDrop,
    handleFileSelect,
    handleRemoveFile,
    resetDialog,
    getFinalFile,
  } = useLogoUploadDialog();

  const handleUpload = async () => {
    const fileToUpload = getFinalFile();
    if (fileToUpload && onLogoUpload) {
      try {
        await onLogoUpload(fileToUpload);
        resetDialog();
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
    resetDialog();
    onClose();
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
