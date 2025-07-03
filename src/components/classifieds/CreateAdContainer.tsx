
import React from 'react';
import { useCreateAdForm } from '@/hooks/useCreateAdForm';
import AdPackageSelector from './AdPackageSelector';
import AdDetailsFormCard from './AdDetailsFormCard';
import AdLocationFormCard from './AdLocationFormCard';
import AdContactFormCard from './AdContactFormCard';
import AdSubmitCard from './AdSubmitCard';

const CreateAdContainer = () => {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    adPackages,
    categories,
    selectedPackage
  } = useCreateAdForm();

  return (
    <div className="space-y-6">
      <AdPackageSelector
        adPackages={adPackages}
        selectedAdType={formData.adType}
        onAdTypeChange={(adType) => handleInputChange('adType', adType)}
      />

      <AdDetailsFormCard
        formData={{
          categoryId: formData.categoryId,
          price: formData.price,
          pricePerUnitType: formData.pricePerUnitType,
          title: formData.title,
          description: formData.description
        }}
        categories={categories}
        onFieldChange={handleInputChange}
      />

      <AdLocationFormCard
        formData={{
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode
        }}
        onFieldChange={handleInputChange}
      />

      <AdContactFormCard
        formData={{
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailAddress: formData.emailAddress,
          phoneNumber: formData.phoneNumber
        }}
        onFieldChange={handleInputChange}
      />

      <AdSubmitCard
        selectedPackage={selectedPackage}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateAdContainer;
