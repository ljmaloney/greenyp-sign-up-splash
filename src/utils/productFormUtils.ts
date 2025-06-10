
import { ProductFormData } from '@/types/productForm';
import { initialProductFormData } from '@/constants/productForm';

export const createResetFormData = (preSelectedLocationId?: string): ProductFormData => {
  return {
    ...initialProductFormData,
    producerLocationId: preSelectedLocationId || ''
  };
};

export const updateFormField = (
  formData: ProductFormData, 
  field: string, 
  value: string | number
): ProductFormData => {
  return { ...formData, [field]: value };
};
