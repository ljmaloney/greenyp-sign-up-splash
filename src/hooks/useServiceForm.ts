
import { useState, useEffect } from 'react';

export interface ServiceFormData {
  shortDescription: string;
  description: string;
  minServicePrice: number;
  maxServicePrice: number;
  priceUnitsType: string;
  serviceTerms: string;
  producerLocationId: string;
}

const initialFormData: ServiceFormData = {
  shortDescription: '',
  description: '',
  minServicePrice: 0,
  maxServicePrice: 0,
  priceUnitsType: 'LOT_SIZE',
  serviceTerms: '',
  producerLocationId: ''
};

export const useServiceForm = (preSelectedLocationId?: string) => {
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);

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
