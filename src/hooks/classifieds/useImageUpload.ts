
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApiFileClient } from '@/hooks/useApiFileClient';
import { useToast } from '@/hooks/use-toast';

interface FileWithCustomName {
  file: File;
  customName: string;
}

export const useImageUpload = (classifiedData: any, packageData: any, maxImages: number) => {
  const { classifiedId } = useParams();
  const navigate = useNavigate();
  const apiFileClient = useApiFileClient();
  const { toast } = useToast();

  const [filesWithNames, setFilesWithNames] = useState<FileWithCustomName[]>([]);
  const [imageDescriptions, setImageDescriptions] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getExtensionFromMimeType = (mimeType: string) => {
    const mimeToExtension: { [key: string]: string } = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/bmp': '.bmp',
      'image/tiff': '.tiff',
      'image/svg+xml': '.svg'
    };
    
    return mimeToExtension[mimeType.toLowerCase()] || '.jpg';
  };

  const generateDefaultImageName = (index: number, mimeType: string) => {
    const paddedIndex = String(index + 1).padStart(4, '0');
    const extension = getExtensionFromMimeType(mimeType);
    return `image-${paddedIndex}${extension}`;
  };

  const getFileNameWithoutExtension = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
  };

  const createRenamedFile = (originalFile: File, newName: string): File => {
    const extension = getExtensionFromMimeType(originalFile.type);
    const finalName = newName.trim() + extension;
    return new File([originalFile], finalName, { type: originalFile.type });
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

    const newFilesWithNames = validFiles.map((file, index) => ({
      file,
      customName: getFileNameWithoutExtension(generateDefaultImageName(filesWithNames.length + index, file.type))
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
        
        await apiFileClient.uploadFile(`/classified/${classifiedId}/image/gallery?imageFilename=${encodeURIComponent(fileToUpload.name)}&imageDescription=${encodeURIComponent(description)}`, formData, {
          requireAuth: false
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

  return {
    filesWithNames,
    imageDescriptions,
    isUploading,
    handleFileSelect,
    removeImage,
    updateDescription,
    updateFileName,
    handleUpload
  };
};
