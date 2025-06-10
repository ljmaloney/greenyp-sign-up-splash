
import { useState, useEffect } from 'react';

export interface ProductFormData {
  producerLocationId: string;
  productType: string;
  botanicalGroup: string;
  name: string;
  price: number;
  availableQuantity: number;
  containerSize: string;
  description: string;
  attributes: Record<string, any>;
}

const initialFormData: ProductFormData = {
  producerLocationId: '',
  productType: 'BAGGED_MATERIAL',
  botanicalGroup: '',
  name: '',
  price: 0,
  availableQuantity: 0,
  containerSize: '',
  description: '',
  attributes: {}
};

export const useProductForm = (preSelectedLocationId?: string) => {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  // Update form data when preSelectedLocationId changes
  useEffect(() => {
    if (preSelectedLocationId) {
      setFormData(prev => ({ ...prev, producerLocationId: preSelectedLocationId }));
    }
  }, [preSelectedLocationId]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      producerLocationId: preSelectedLocationId || ''
    });
  };

  return {
    formData,
    handleChange,
    resetForm
  };
};
