
import React from 'react';
import { useToast } from "@/hooks/use-toast.ts";
import { useApiClient } from '@/hooks/useApiClient';
import { FULL_NAME_TO_ABBREVIATION } from "@/constants/usStates.ts";
import EditLocationFormFields from "./EditLocationFormFields.tsx";
import { Location } from "@/services/locationService.ts";
import { LocationFormData } from "@/types/location.ts";

interface EditLocationFormProps {
  formData: LocationFormData;
  onFieldChange: (field: keyof LocationFormData, value: string | boolean) => void;
  location: Location;
  onLocationUpdated: (location: LocationFormData) => void;
  onClose: () => void;
  children: React.ReactNode;
}

const EditLocationForm = ({ 
  formData, 
  onFieldChange, 
  location, 
  onLocationUpdated, 
  onClose,
  children 
}: EditLocationFormProps) => {
  const { toast } = useToast();
  const apiClient = useApiClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('Updating location:', formData);

      // Convert full state name back to abbreviation for API
      const stateAbbreviation = FULL_NAME_TO_ABBREVIATION[formData.state] || formData.state;

      // Prepare payload matching API specification
      const payload = {
        locationId: formData.locationId,
        locationName: formData.locationName,
        locationType: formData.locationType,
        locationDisplayType: formData.locationDisplayType,
        active: formData.active,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        addressLine3: formData.addressLine3,
        city: formData.city,
        state: stateAbbreviation,
        postalCode: formData.postalCode,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        websiteUrl: formData.websiteUrl
      };

      const result = await apiClient.put('/producer/location', payload);
      
      toast({
        title: "Location Updated",
        description: "Location has been successfully updated.",
      });
      
      onLocationUpdated(formData);
      onClose();
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Error",
        description: "Failed to update location. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <EditLocationFormFields
        formData={formData}
        onFieldChange={onFieldChange}
      />
      {children}
    </form>
  );
};

export default EditLocationForm;
