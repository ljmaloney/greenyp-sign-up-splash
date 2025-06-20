
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Edit2 } from 'lucide-react';

interface FilePreviewWithRenameProps {
  file: File;
  customFileName: string;
  onCustomFileNameChange: (name: string) => void;
  onRemoveFile: () => void;
}

const FilePreviewWithRename = ({
  file,
  customFileName,
  onCustomFileNameChange,
  onRemoveFile
}: FilePreviewWithRenameProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <Upload className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveFile}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileName" className="text-sm font-medium flex items-center gap-2">
            <Edit2 className="h-4 w-4" />
            Rename File (optional)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="fileName"
              placeholder="Enter new name"
              value={customFileName}
              onChange={(e) => onCustomFileNameChange(e.target.value)}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 font-mono">
              {getFileExtension(file.name)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Final name: {(customFileName.trim() || file.name.substring(0, file.name.lastIndexOf('.')))}
            {getFileExtension(file.name)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewWithRename;
