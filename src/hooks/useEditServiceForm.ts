
import { useState, useEffect } from 'react';
import { ProductResponse } from '@/services/servicesService';

export interface EditServiceFormData {
  minServicePrice: number;
  maxServicePrice: number;
  priceUnitsType: "LOT_SIZE" | "PER_HOUR" | "PER_MILE" | "PER_VISIT" | "FIXED_ESTIMATE";
  shortDescription: string;
  description: string;
  serviceTerms: string;
}

export const useEditServiceForm = (service: ProductResponse | null) => {
  const [formData, setFormData] = useState<EditServiceFormData>({
    minServicePrice: 0,
    maxServicePrice: 0,
    priceUnitsType: "FIXED_ESTIMATE",
    shortDescription: '',
    description: '',
    serviceTerms: ''
  });

  useEffect(() => {
    if (service) {
      setFormData({
        minServicePrice: service.price || 0,
        maxServicePrice: service.price || 0,
        priceUnitsType: "FIXED_ESTIMATE",
        shortDescription: service.name || '',
        description: service.description || '',
        serviceTerms: ''
      });
    }
  }, [service]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    formData,
    handleChange
  };
};
