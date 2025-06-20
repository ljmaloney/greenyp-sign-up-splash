
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface LogoDialogFooterProps {
  hasExistingLogo: boolean;
  hasSelectedFile: boolean;
  isLogoUploading: boolean;
  isLogoDeleting: boolean;
  onDelete: () => void;
  onCancel: () => void;
  onUpload: () => void;
}

const LogoDialogFooter = ({
  hasExistingLogo,
  hasSelectedFile,
  isLogoUploading,
  isLogoDeleting,
  onDelete,
  onCancel,
  onUpload
}: LogoDialogFooterProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      {hasExistingLogo && !hasSelectedFile && (
        <Button 
          variant="destructive" 
          onClick={onDelete}
          disabled={isLogoDeleting}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {isLogoDeleting ? 'Deleting...' : 'Delete Logo'}
        </Button>
      )}
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button 
        onClick={onUpload}
        disabled={!hasSelectedFile || isLogoUploading}
      >
        {isLogoUploading ? 'Uploading...' : 'Upload Logo'}
      </Button>
    </div>
  );
};

export default LogoDialogFooter;
