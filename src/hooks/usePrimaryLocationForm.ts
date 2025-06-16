
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from '@/config/api';
import { PrimaryLocation, Producer } from '@/services/accountService';

interface UsePrimaryLocationFormProps {
  primaryLocation: PrimaryLocation;
  producer: Producer;
  onClose: () => void;
}

export const usePrimaryLocationForm = ({ primaryLocation, producer, onClose }: UsePrimaryLocationFormProps) => {
  const [formData, setFormData] = useState({
    locationName: primaryLocation.locationName,
    locationDisplayType: primaryLocation.locationDisplayType,
    addressLine1: primaryLocation.addressLine1,
    addressLine2: primaryLocation.addressLine2 || '',
    city: primaryLocation.city,
    state: primaryLocation.state,
    postalCode: primaryLocation.postalCode,
    latitude: primaryLocation.latitude,
    longitude: primaryLocation.longitude,
    websiteUrl: primaryLocation.websiteUrl || producer.websiteUrl || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        locationId: primaryLocation.locationId,
        locationName: formData.locationName,
        locationType: primaryLocation.locationType, // Not editable
        locationDisplayType: formData.locationDisplayType,
        active: primaryLocation.active,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        websiteUrl: formData.websiteUrl || producer.websiteUrl || ''
      };

      console.log('🚀 Updating primary location with payload:', payload);
      
      const response = await fetch(getApiUrl('/producer/location'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update primary location: ${response.status}`);
      }

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
