
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploadZone from './ImageUploadZone';
import PricingTierSelector from './PricingTierSelector';
import AdDetailsForm from './AdDetailsForm';
import LocationForm from './LocationForm';
import ContactForm from './ContactForm';
import AdSubmitSection from './AdSubmitSection';
import { ClassifiedFormData } from '@/types/classifieds';
import { useToast } from '@/hooks/use-toast';
import { useAdPackages } from '@/hooks/useAdPackages';

interface ExtendedClassifiedFormData extends Omit<ClassifiedFormData, 'pricingTier'> {
  price?: string;
  per?: string;
  address?: string;
  city?: string;
  state?: string;
  pricingTier: string; // Now stores adTypeId
}

const CreateAdForm = () => {
  const { toast } = useToast();
  const { data: adPackagesData } = useAdPackages();
  
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
    pricingTier: '', // Will be set to first available adTypeId
    images: []
  });

  // Set default tier to first available package if not set
  React.useEffect(() => {
    if (adPackagesData?.response && adPackagesData.response.length > 0 && !formData.pricingTier) {
      const firstActivePackage = adPackagesData.response.find(pkg => pkg.active);
      if (firstActivePackage) {
        setFormData(prev => ({ ...prev, pricingTier: firstActivePackage.adTypeId }));
      }
    }
  }, [adPackagesData, formData.pricingTier]);

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

    const selectedPackage = adPackagesData?.response?.find(pkg => pkg.adTypeId === formData.pricingTier);
    if (!selectedPackage) {
      toast({
        title: "Error",
        description: "Please select a valid ad package",
        variant: "destructive"
      });
      return;
    }

    if (formData.images.length > selectedPackage.features.maxImages) {
      toast({
        title: "Error",
        description: `Too many images for ${selectedPackage.adTypeName} package. Maximum: ${selectedPackage.features.maxImages}`,
        variant: "destructive"
      });
      return;
    }

    // Here you would normally submit to your API
    console.log('Submitting classified ad:', formData);
    
    toast({
      title: "Success!",
      description: `Your ad has been posted! You will be charged $${selectedPackage.monthlyPrice}/month.`,
    });
  };

  const selectedPackage = adPackagesData?.response?.find(pkg => pkg.adTypeId === formData.pricingTier);

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

      {selectedPackage && selectedPackage.features.maxImages > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Images (Up to {selectedPackage.features.maxImages})</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploadZone
              images={formData.images}
              maxImages={selectedPackage.features.maxImages}
              onImagesChange={(images) => handleInputChange('images', images)}
            />
          </CardContent>
        </Card>
      )}

      <ContactForm
        email={formData.email}
        phone={formData.phone}
        hasContactObfuscation={selectedPackage?.features.protectContact || false}
        onFieldChange={handleInputChange}
      />

      <AdSubmitSection
        price={selectedPackage?.monthlyPrice || 0}
        onSubmit={() => handleSubmit(new Event('submit') as any)}
      />
    </form>
  );
};

export default CreateAdForm;
