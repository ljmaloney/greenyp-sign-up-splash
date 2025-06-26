
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploadZone from './ImageUploadZone';
import PricingTierSelector from './PricingTierSelector';
import AdDetailsForm from './AdDetailsForm';
import LocationForm from './LocationForm';
import ContactForm from './ContactForm';
import AdSubmitSection from './AdSubmitSection';
import { ClassifiedFormData, PRICING_TIERS } from '@/types/classifieds';
import { useToast } from '@/hooks/use-toast';

interface ExtendedClassifiedFormData extends ClassifiedFormData {
  price?: string;
  per?: string;
  address?: string;
  city?: string;
  state?: string;
}

const CreateAdForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ExtendedClassifiedFormData>({
    title: '',
    description: '',
    category: '',
    price: '',
    per: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
    pricingTier: 'basic',
    images: []
  });

  const handleInputChange = (field: keyof ExtendedClassifiedFormData, value: string | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.category || 
        !formData.zipCode || !formData.email || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedTier = PRICING_TIERS[formData.pricingTier];
    if (formData.images.length > selectedTier.maxImages) {
      toast({
        title: "Error",
        description: `Too many images for ${selectedTier.name} tier. Maximum: ${selectedTier.maxImages}`,
        variant: "destructive"
      });
      return;
    }

    // Here you would normally submit to your API
    console.log('Submitting classified ad:', formData);
    
    toast({
      title: "Success!",
      description: `Your ad has been posted! You will be charged $${selectedTier.price}/month.`,
    });
  };

  const selectedTier = PRICING_TIERS[formData.pricingTier];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PricingTierSelector
        selectedTier={formData.pricingTier}
        onTierChange={(tier) => handleInputChange('pricingTier', tier)}
      />

      <AdDetailsForm
        title={formData.title}
        description={formData.description}
        category={formData.category}
        price={formData.price}
        per={formData.per}
        onFieldChange={handleInputChange}
      />

      <LocationForm
        address={formData.address}
        city={formData.city}
        state={formData.state}
        zipCode={formData.zipCode}
        onFieldChange={handleInputChange}
      />

      {selectedTier.maxImages > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Images (Up to {selectedTier.maxImages})</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploadZone
              images={formData.images}
              maxImages={selectedTier.maxImages}
              onImagesChange={(images) => handleInputChange('images', images)}
            />
          </CardContent>
        </Card>
      )}

      <ContactForm
        email={formData.email}
        phone={formData.phone}
        hasContactObfuscation={selectedTier.contactObfuscation}
        onFieldChange={handleInputChange}
      />

      <AdSubmitSection
        price={selectedTier.price}
        onSubmit={() => handleSubmit(new Event('submit') as any)}
      />
    </form>
  );
};

export default CreateAdForm;
