
import { useState, useEffect } from 'react';

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

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
  productType?: string;
  botanicalGroup?: string;
  containerSize?: string;
  availableQuantity?: number;
  discontinued?: boolean;
}

export const useEditProductForm = (product: Product | null) => {
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
        botanicalGroup: product.botanicalGroup || product.category || '',
        name: product.name,
        price: product.price,
        availableQuantity: product.availableQuantity || product.quantity,
        containerSize: product.containerSize || '',
        description: product.description,
        discontinued: product.discontinued || false,
        discontinueDate: '',
        lastOrderDate: '',
        attributeMap: {}
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
