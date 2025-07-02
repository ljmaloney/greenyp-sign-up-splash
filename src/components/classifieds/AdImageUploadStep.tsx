
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImageUploadZone from './ImageUploadZone';
import { ArrowLeft } from 'lucide-react';
import { AdPackage } from '@/types/adPackages';

interface AdImageUploadStepProps {
  images: File[];
  maxImages: number;
  onImagesChange: (images: File[]) => void;
  onProceedToPayment: () => void;
  onBack: () => void;
  selectedPackage?: AdPackage;
}

const AdImageUploadStep = ({ 
  images, 
  maxImages, 
  onImagesChange, 
  onProceedToPayment, 
  onBack,
  selectedPackage 
}: AdImageUploadStepProps) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4 border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Details
        </Button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Upload Images</h2>
        <p className="text-gray-600">
          Add up to {maxImages} images to showcase your item or service
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Images (Up to {maxImages})</CardTitle>
          <p className="text-sm text-gray-600">
            {selectedPackage?.adTypeName} package allows up to {maxImages} images
          </p>
        </CardHeader>
        <CardContent>
          <ImageUploadZone
            images={images}
            maxImages={maxImages}
            onImagesChange={onImagesChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Next: Payment</div>
              <div className="text-sm text-gray-600">
                Complete payment - ${selectedPackage?.monthlyPrice}/month
              </div>
            </div>
            <Button 
              onClick={onProceedToPayment}
              size="lg" 
              className="bg-greenyp-600 hover:bg-greenyp-700"
            >
              Proceed to Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdImageUploadStep;
