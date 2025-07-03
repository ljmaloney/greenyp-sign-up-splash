
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

const ImageUploadForm = ({ classifiedData, packageData, maxImages }: ImageUploadFormProps) => {
  const { classifiedId } = useParams();
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const { toast } = useToast();

  const [images, setImages] = useState<File[]>([]);
  const [imageDescriptions, setImageDescriptions] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = images.length + newFiles.length;

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

    setImages(prev => [...prev, ...validFiles]);
    setImageDescriptions(prev => [...prev, ...validFiles.map(() => '')]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageDescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const updateDescription = (index: number, description: string) => {
    setImageDescriptions(prev => prev.map((desc, i) => i === index ? description : desc));
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      // Skip to payment if no images
      navigate(`/classifieds/payment/${classifiedId}`, { 
        state: { classifiedData, packageData }
      });
      return;
    }

    setIsUploading(true);
    try {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const description = imageDescriptions[i] || file.name;
        
        const formData = new FormData();
        formData.append('image', file);
        
        await apiClient.request(`/classified/images/${classifiedId}/gallery?imageFileName=${encodeURIComponent(file.name)}&imageDescription=${encodeURIComponent(description)}`, {
          method: 'POST',
          body: formData,
          requireAuth: false,
          headers: {} // Don't set Content-Type for FormData
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
          <CardTitle>Upload Images ({images.length}/{maxImages})</CardTitle>
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
            images={images}
            imageDescriptions={imageDescriptions}
            onRemoveImage={removeImage}
            onUpdateDescription={updateDescription}
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
          {isUploading ? 'Uploading...' : images.length > 0 ? 'Upload & Continue' : 'Skip & Continue'}
        </Button>
      </div>
    </div>
  );
};

export default ImageUploadForm;
