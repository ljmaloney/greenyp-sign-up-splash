
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Image, Key, Loader2 } from 'lucide-react';
import { RunwareService, GeneratedImage } from '@/services/runwareService';
import { toast } from 'sonner';

const OGImageGenerator = () => {
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const defaultPrompt = "Professional business directory banner for GreenYP green industry services, featuring landscaping tools, lawn mowers, plants, gardening equipment, clean modern design with vibrant green color scheme, GreenYP logo text, high quality, business professional, social media banner, 1200x630 aspect ratio";

  const handleGenerateImage = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter your Runware API key');
      return;
    }

    setIsGenerating(true);
    try {
      const runwareService = new RunwareService(apiKey);
      const promptToUse = customPrompt.trim() || defaultPrompt;
      
      console.log('Generating OG image with prompt:', promptToUse);
      
      const result = await runwareService.generateImage({
        positivePrompt: promptToUse,
        model: "runware:100@1",
        numberResults: 1,
        outputFormat: "WEBP",
        CFGScale: 1,
        scheduler: "FlowMatchEulerDiscreteScheduler",
        strength: 0.8
      });

      setGeneratedImage(result);
      toast.success('OG image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage.imageURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'greenyp-og-image.webp';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-greenyp-700">GreenYP OG Image Generator</h1>
        <p className="text-gray-600">Generate a professional Open Graph image for social media sharing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Enter your Runware API key to generate images. Get your key from{' '}
            <a href="https://runware.ai/" target="_blank" rel="noopener noreferrer" className="text-greenyp-600 hover:underline">
              runware.ai
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">Runware API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Runware API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Image Generation
          </CardTitle>
          <CardDescription>
            Customize the prompt or use the default to generate your OG image
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">Custom Prompt (optional)</Label>
              <Textarea
                id="prompt"
                placeholder={defaultPrompt}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="mt-1 min-h-[100px]"
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to use the default GreenYP-optimized prompt
              </p>
            </div>

            <Button 
              onClick={handleGenerateImage} 
              disabled={isGenerating || !apiKey.trim()}
              className="w-full bg-greenyp-600 hover:bg-greenyp-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Image className="w-4 h-4 mr-2" />
                  Generate OG Image
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Generated OG Image</CardTitle>
            <CardDescription>
              Preview of your generated image (1200x630px - optimized for social media)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={generatedImage.imageURL} 
                  alt="Generated OG Image" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>Seed: {generatedImage.seed}</p>
                  <p>Format: WEBP, 1200x630px</p>
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
            <p className="font-medium">After generating and downloading your image:</p>
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
