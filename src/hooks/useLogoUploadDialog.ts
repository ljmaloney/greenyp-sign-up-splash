
import { useState } from 'react';
import { createRenamedFile, getNameWithoutExtension } from '@/utils/fileUtils';

export const useLogoUploadDialog = () => {
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
    const nameWithoutExt = getNameWithoutExtension(file.name);
    setCustomFileName(nameWithoutExt);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setCustomFileName('');
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setCustomFileName('');
    setDragActive(false);
  };

  const getFinalFile = (): File | null => {
    if (!selectedFile) return null;
    
    return customFileName.trim() 
      ? createRenamedFile(selectedFile, customFileName.trim())
      : selectedFile;
  };

  return {
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
  };
};
