
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/useApiClient';
import { createLocationService } from '@/services/locationService';
import { PrimaryLocation, Producer } from '@/services/accountService';
import { STATE_ABBREVIATIONS, FULL_NAME_TO_ABBREVIATION } from '@/constants/usStates';

interface UsePrimaryLocationFormProps {
  primaryLocation: PrimaryLocation;
  producer: Producer;
  onClose: () => void;
}

export const usePrimaryLocationForm = ({ primaryLocation, producer, onClose }: UsePrimaryLocationFormProps) => {
  // Convert state abbreviation to full name for display
  const displayState = STATE_ABBREVIATIONS[primaryLocation.state] || primaryLocation.state;
  
  const [formData, setFormData] = useState({
    locationName: primaryLocation.locationName,
    locationDisplayType: primaryLocation.locationDisplayType,
    addressLine1: primaryLocation.addressLine1,
    addressLine2: primaryLocation.addressLine2 || '',
    city: primaryLocation.city,
    state: displayState,
    postalCode: primaryLocation.postalCode,
    latitude: primaryLocation.latitude,
    longitude: primaryLocation.longitude,
    websiteUrl: primaryLocation.websiteUrl || producer.websiteUrl || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  const locationService = createLocationService(apiClient);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert full state name back to abbreviation for API
      const stateAbbreviation = FULL_NAME_TO_ABBREVIATION[formData.state] || formData.state;
      
      const payload = {
        locationId: primaryLocation.locationId,
        locationName: formData.locationName,
        locationType: primaryLocation.locationType, // Not editable
        locationDisplayType: formData.locationDisplayType,
        active: primaryLocation.active,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: stateAbbreviation,
        postalCode: formData.postalCode,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        websiteUrl: formData.websiteUrl || producer.websiteUrl || ''
      };

      console.log('🚀 Updating primary location with payload:', payload);
      
      await locationService.updateLocation(payload);

      // Invalidate and refetch account data
      queryClient.invalidateQueries({ queryKey: ['accountData'] });
      
      toast({
        title: "Primary Location Updated",
        description: "Your primary location has been successfully updated.",
      });
      
      onClose();
    } catch (error) {
      console.error('❌ Error updating primary location:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update primary location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};
