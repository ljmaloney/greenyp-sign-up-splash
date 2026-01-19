
import { useState } from 'react';
import { LocationFormData } from "@/types/location";

const getInitialFormData = (): LocationFormData => ({
  locationName: '',
  locationType: 'HOME_OFFICE_PRIMARY',
  locationDisplayType: 'NO_DISPLAY',
  active: true,
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  city: '',
  state: '',
  postalCode: '',
  latitude: '',
  longitude: '',
  websiteUrl: '',
  // Contact-related fields
  emailAddress: '',
  cellPhoneNumber: '',
  phoneNumber: '',
  title: '',
  lastName: '',
  firstName: '',
  genericContactName: '',
  displayContactType: 'NO_DISPLAY'
});

export const useLocationForm = (initialData?: Partial<LocationFormData>) => {
  const [formData, setFormData] = useState<LocationFormData>(() => ({
    ...getInitialFormData(),
    ...initialData
  }));

  const handleChange = (field: keyof LocationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
  };

  return {
    formData,
    handleChange,
    resetForm,
    setFormData
  };
};
