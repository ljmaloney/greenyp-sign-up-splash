
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PricingTierSelector from './PricingTierSelector';
import AdDetailsForm from './AdDetailsForm';
import LocationForm from './LocationForm';
import ContactForm from './ContactForm';
import { AdPackage } from '@/types/adPackages';

interface ExtendedClassifiedFormData {
  title: string;
  description: string;
  category: string;
  price?: string;
  per?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pricingTier: string;
  images: File[];
}

interface AdBasicDetailsStepProps {
  formData: ExtendedClassifiedFormData;
  onFieldChange: (field: string, value: string | File[]) => void;
  onSubmit: () => void;
  selectedPackage?: AdPackage;
}

const AdBasicDetailsStep = ({ formData, onFieldChange, onSubmit, selectedPackage }: AdBasicDetailsStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1: Basic Ad Details</h2>
        <p className="text-gray-600">Fill in your ad information and select your package</p>
      </div>

      <PricingTierSelector
        selectedTier={formData.pricingTier}
        onTierChange={(tier) => onFieldChange('pricingTier', tier)}
      />

      <AdDetailsForm
        title={formData.title}
        description={formData.description}
        category={formData.category}
        price={formData.price}
        per={formData.per}
        onFieldChange={onFieldChange}
      />

      <LocationForm
        address={formData.address}
        city={formData.city}
        state={formData.state}
        zipCode={formData.zipCode}
        onFieldChange={onFieldChange}
      />

      <ContactForm
        firstName={formData.firstName}
        lastName={formData.lastName}
        email={formData.email}
        phone={formData.phone}
        hasContactObfuscation={selectedPackage?.features.protectContact || false}
        onFieldChange={onFieldChange}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">
                Next: {selectedPackage?.features.maxImages ? 'Image Upload' : 'Payment'}
              </div>
              <div className="text-sm text-gray-600">
                {selectedPackage?.features.maxImages 
                  ? `Upload up to ${selectedPackage.features.maxImages} images`
                  : `Complete payment - $${selectedPackage?.monthlyPrice}/month`
                }
              </div>
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="bg-greenyp-600 hover:bg-greenyp-700"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default AdBasicDetailsStep;
