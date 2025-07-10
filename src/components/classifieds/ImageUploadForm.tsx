
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApiClient } from '@/hooks/useApiClient';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import ImagePreview from './ImagePreview';

interface ImageUploadFormProps {
  classifiedData: any;
  packageData: any;
  maxImages: number;
}

interface FileWithCustomName {
  file: File;
  customName: string;
}

const ImageUploadForm = ({ classifiedData, packageData, maxImages }: ImageUploadFormProps) => {
  const { classifiedId } = useParams();
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const { toast } = useToast();

  const [filesWithNames, setFilesWithNames] = useState<FileWithCustomName[]>([]);
  const [imageDescriptions, setImageDescriptions] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getFileExtension = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
  };

  const getFileNameWithoutExtension = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = filesWithNames.length + newFiles.length;

    if (totalImages > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images`,
        variant: "destructive"
      });
      return;
    }

    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive"
        });
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is too large. Maximum size is 5MB`,
          variant: "destructive"
        });
        return false;
      }

      return true;
    });

    const newFilesWithNames = validFiles.map(file => ({
      file,
      customName: getFileNameWithoutExtension(file.name)
    }));

    setFilesWithNames(prev => [...prev, ...newFilesWithNames]);
    setImageDescriptions(prev => [...prev, ...validFiles.map(() => '')]);
  };

  const removeImage = (index: number) => {
    setFilesWithNames(prev => prev.filter((_, i) => i !== index));
    setImageDescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const updateDescription = (index: number, description: string) => {
    setImageDescriptions(prev => prev.map((desc, i) => i === index ? description : desc));
  };

  const updateFileName = (index: number, customName: string) => {
    setFilesWithNames(prev => prev.map((item, i) => 
      i === index ? { ...item, customName } : item
    ));
  };

  const createRenamedFile = (originalFile: File, newName: string): File => {
    const extension = getFileExtension(originalFile.name);
    const finalName = newName.trim() + extension;
    return new File([originalFile], finalName, { type: originalFile.type });
  };

  const handleUpload = async () => {
    if (filesWithNames.length === 0) {
      // Skip to payment if no images
      navigate(`/classifieds/payment/${classifiedId}`, { 
        state: { classifiedData, packageData }
      });
      return;
    }

    setIsUploading(true);
    try {
      for (let i = 0; i < filesWithNames.length; i++) {
        const { file: originalFile, customName } = filesWithNames[i];
        const description = imageDescriptions[i] || '';
        
        // Create renamed file if custom name is provided
        const fileToUpload = customName.trim() 
          ? createRenamedFile(originalFile, customName.trim())
          : originalFile;
        
        const formData = new FormData();
        formData.append('file', fileToUpload);
        
        console.log('📤 Uploading file:', {
          originalFileName: originalFile.name,
          finalFileName: fileToUpload.name,
          customName,
          description,
          fileSize: fileToUpload.size,
          fileType: fileToUpload.type
        });
        
        // Fixed parameter name from imageFileName to imageFilename
        await apiClient.request(`/classified/images/${classifiedId}/gallery?imageFilename=${encodeURIComponent(fileToUpload.name)}&imageDescription=${encodeURIComponent(description)}`, {
          method: 'POST',
          body: formData,
          requireAuth: false,
          headers: {}
        });
      }

      toast({
        title: "Success!",
        description: "Images uploaded successfully!",
      });

      navigate(`/classifieds/payment/${classifiedId}`, { 
        state: { classifiedData, packageData }
      });
    } catch (error) {
      console.error('❌ Error uploading images:', error);
      toast({
        title: "Error",
        description: `Failed to upload images: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Images ({filesWithNames.length}/{maxImages})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('fileInput')?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Click to upload or drag and drop images here
            </p>
            <p className="text-sm text-gray-500">
              Up to {maxImages} images, 5MB max each
            </p>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Image Previews */}
          <ImagePreview
            filesWithNames={filesWithNames}
            imageDescriptions={imageDescriptions}
            onRemoveImage={removeImage}
            onUpdateDescription={updateDescription}
            onUpdateFileName={updateFileName}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/classifieds/create')}
          className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50"
        >
          Back
        </Button>
        <Button 
          onClick={handleUpload}
          disabled={isUploading}
          className="bg-greenyp-600 hover:bg-greenyp-700 px-8"
        >
          {isUploading ? 'Uploading...' : filesWithNames.length > 0 ? 'Upload & Continue' : 'Skip & Continue'}
        </Button>
      </div>
    </div>
  );
};

export default ImageUploadForm;
