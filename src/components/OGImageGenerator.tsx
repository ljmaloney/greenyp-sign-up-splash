
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Download, Image, X } from 'lucide-react';
import { toast } from 'sonner';

const OGImageGenerator = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    toast.success('Image uploaded successfully!');
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    toast.success('Image uploaded successfully!');
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadImage = async () => {
    if (!selectedImage) return;

    try {
      const url = URL.createObjectURL(selectedImage);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'greenyp-og-image.' + selectedImage.name.split('.').pop();
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const generateDefaultImage = () => {
    // Create a canvas with GreenYP branding
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set OG image dimensions
    canvas.width = 1200;
    canvas.height = 630;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#10b981'); // greenyp-500
    gradient.addColorStop(1, '#059669'); // greenyp-600

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add title text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GreenYP', canvas.width / 2, 250);

    // Add subtitle
    ctx.font = '36px Arial, sans-serif';
    ctx.fillText('The Green Industry Business Directory', canvas.width / 2, 320);

    // Add description
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText('Connect with landscaping, lawn care, and green industry services', canvas.width / 2, 420);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'greenyp-og-image.png', { type: 'image/png' });
        setSelectedImage(file);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        toast.success('Default OG image generated!');
      }
    }, 'image/png');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-greenyp-700">GreenYP OG Image Manager</h1>
        <p className="text-gray-600">Upload or generate a professional Open Graph image for social media sharing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Image
          </CardTitle>
          <CardDescription>
            Upload your own OG image (recommended size: 1200x630px) or generate a default GreenYP branded image
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-greenyp-400 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your image here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports PNG, JPG, WebP (max 5MB)
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="mr-2"
              >
                Choose File
              </Button>
              <Button
                onClick={generateDefaultImage}
                className="bg-greenyp-600 hover:bg-greenyp-700"
              >
                Generate Default Image
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {previewUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Preview</span>
              <Button
                onClick={handleRemoveImage}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Preview of your OG image (1200x630px - optimized for social media)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="OG Image Preview" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>File: {selectedImage?.name}</p>
                  <p>Size: {selectedImage ? (selectedImage.size / 1024 / 1024).toFixed(2) : 0}MB</p>
                </div>
                
                <Button onClick={handleDownloadImage} className="bg-greenyp-600 hover:bg-greenyp-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p className="font-medium">After uploading/generating and downloading your image:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Upload the downloaded image to your hosting service or CDN</li>
              <li>Copy the hosted image URL</li>
              <li>Update the meta tags in your index.html file:</li>
            </ol>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
              <div>{`<!-- Replace these lines in index.html -->`}</div>
              <div>{`<meta property="og:image" content="YOUR_HOSTED_IMAGE_URL" />`}</div>
              <div>{`<meta name="twitter:image" content="YOUR_HOSTED_IMAGE_URL" />`}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OGImageGenerator;
