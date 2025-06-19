
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
}

const LogoUploadButton = ({ 
  onLogoUpload, 
  isLogoUploading, 
  hasLogoFeature, 
  producer 
}: LogoUploadButtonProps) => {
  const handleLogoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onLogoUpload) {
        onLogoUpload(file);
      }
    };
    input.click();
  };

  if (!hasLogoFeature) {
    return null;
  }

  return (
    <div className="flex-shrink-0">
      {producer.iconLink ? (
        <img 
          src={producer.iconLink} 
          alt={`${producer.businessName} logo`}
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogoUpload}
          disabled={isLogoUploading}
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
