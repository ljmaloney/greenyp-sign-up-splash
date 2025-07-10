
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ImageUploadActionsProps {
  isUploading: boolean;
  filesCount: number;
  onUpload: () => void;
}

const ImageUploadActions = ({ isUploading, filesCount, onUpload }: ImageUploadActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        onClick={() => navigate('/classifieds/create')}
        className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50"
      >
        Back
      </Button>
      <Button 
        onClick={onUpload}
        disabled={isUploading}
        className="bg-greenyp-600 hover:bg-greenyp-700 px-8"
      >
        {isUploading ? 'Uploading...' : filesCount > 0 ? 'Upload & Continue' : 'Skip & Continue'}
      </Button>
    </div>
  );
};

export default ImageUploadActions;
