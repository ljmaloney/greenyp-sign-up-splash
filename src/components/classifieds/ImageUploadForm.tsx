
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImagePreview from './ImagePreview';
import ImageUploadZone from './ImageUploadZone';
import ImageUploadActions from './ImageUploadActions';

interface ImageUploadFormProps {
  classifiedData: any;
  packageData: any;
  maxImages: number;
}

const ImageUploadForm = ({ classifiedData, packageData, maxImages }: ImageUploadFormProps) => {
  const {
    filesWithNames,
    imageDescriptions,
    isUploading,
    handleFileSelect,
    removeImage,
    updateDescription,
    updateFileName,
    handleUpload
  } = useImageUpload(classifiedData, packageData, maxImages);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Images ({filesWithNames.length}/{maxImages})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploadZone
            maxImages={maxImages}
            onFileSelect={handleFileSelect}
          />

          <ImagePreview
            filesWithNames={filesWithNames}
            imageDescriptions={imageDescriptions}
            onRemoveImage={removeImage}
            onUpdateDescription={updateDescription}
            onUpdateFileName={updateFileName}
          />
        </CardContent>
      </Card>

      <ImageUploadActions
        isUploading={isUploading}
        filesCount={filesWithNames.length}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default ImageUploadForm;
