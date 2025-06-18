
import { useState, useEffect } from 'react';
import { ProductResponse } from '@/services/servicesService';

export interface EditProductFormData {
  productType: string;
  botanicalGroup: string;
  name: string;
  price: number;
  availableQuantity: number;
  containerSize: string;
  description: string;
  discontinued: boolean;
  discontinueDate: string;
  lastOrderDate: string;
  attributeMap: Record<string, any>;
}

export const useEditProductForm = (product: ProductResponse | null) => {
  const [formData, setFormData] = useState<EditProductFormData>({
    productType: 'BAGGED_MATERIAL',
    botanicalGroup: '',
    name: '',
    price: 0,
    availableQuantity: 0,
    containerSize: '',
    description: '',
    discontinued: false,
    discontinueDate: '',
    lastOrderDate: '',
    attributeMap: {}
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productType: product.productType || 'BAGGED_MATERIAL',
        botanicalGroup: product.botanicalGroup || '',
        name: product.name,
        price: product.price,
        availableQuantity: product.availableQuantity,
        containerSize: product.containerSize || '',
        description: product.description,
        discontinued: product.discontinued || false,
        discontinueDate: product.discontinueDate || '',
        lastOrderDate: product.lastOrderDate || '',
        attributeMap: product.attributes || {}
      });
    }
  }, [product]);

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange
  };
};
