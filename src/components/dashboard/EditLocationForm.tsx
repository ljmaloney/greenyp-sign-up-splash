
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";
import { FULL_NAME_TO_ABBREVIATION } from "@/constants/usStates";
import LocationFormFields from "./LocationFormFields";
import { Location } from "@/services/locationService";
import { LocationFormData } from "@/types/location";

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
      
      const response = await fetch(getApiUrl('/producer/location'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update location: ${response.status}`);
      }

      const result = await response.json();
      
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
      <LocationFormFields
        formData={formData}
        onFieldChange={onFieldChange}
      />
      {children}
    </form>
  );
};

export default EditLocationForm;
