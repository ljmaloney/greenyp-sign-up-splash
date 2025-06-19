
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface LogoUploadButtonProps {
  onLogoUpload?: (file: File) => Promise<void>;
  isLogoUploading?: boolean;
  hasLogoFeature: boolean;
  producer: {
    iconLink?: string;
    businessName: string;
  };
  onUploadClick: () => void;
}

const LogoUploadButton = ({ 
  hasLogoFeature, 
  producer,
  onUploadClick
}: LogoUploadButtonProps) => {
  if (!hasLogoFeature) {
    return null;
  }

  return (
    <div className="flex-shrink-0">
      {producer.iconLink ? (
        <div className="relative group">
          <img 
            src={producer.iconLink} 
            alt={`${producer.businessName} logo`}
            className="w-12 h-12 object-cover rounded cursor-pointer"
            onClick={onUploadClick}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center cursor-pointer"
               onClick={onUploadClick}>
            <Upload className="h-5 w-5 text-white" />
          </div>
        </div>
      ) : (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onUploadClick}
          className="w-12 h-12 p-0 border-2 border-dashed border-gray-300 hover:border-gray-400"
          title="Upload logo"
        >
          <Upload className="h-5 w-5 text-gray-400" />
        </Button>
      )}
    </div>
  );
};

export default LogoUploadButton;
