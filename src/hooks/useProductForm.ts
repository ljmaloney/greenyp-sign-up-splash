
import { useState, useEffect } from 'react';
import { ProductFormData } from '@/types/productForm';
import { initialProductFormData } from '@/constants/productForm';
import { createResetFormData, updateFormField } from '@/utils/productFormUtils';

export const useProductForm = (preSelectedLocationId?: string) => {
  const [formData, setFormData] = useState<ProductFormData>(initialProductFormData);

  // Update form data when preSelectedLocationId changes
  useEffect(() => {
    if (preSelectedLocationId) {
      setFormData(prev => ({ ...prev, producerLocationId: preSelectedLocationId }));
    }
  }, [preSelectedLocationId]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => updateFormField(prev, field, value));
  };

  const resetForm = () => {
    setFormData(createResetFormData(preSelectedLocationId));
  };

  return {
    formData,
    handleChange,
    resetForm
  };
};
