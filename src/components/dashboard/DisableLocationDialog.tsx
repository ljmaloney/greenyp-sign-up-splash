
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";
import { Location } from "@/services/locationService";
import { LocationFormData } from "@/types/location";

interface DisableLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location;
  formData: LocationFormData;
  onLocationUpdated: (location: LocationFormData) => void;
  onDialogClose: () => void;
}

const DisableLocationDialog = ({ 
  isOpen, 
  onClose, 
  location, 
  formData, 
  onLocationUpdated, 
  onDialogClose 
}: DisableLocationDialogProps) => {
  const { toast } = useToast();

  const handleDisableLocation = async () => {
    try {
      const updatedFormData = { ...formData, active: false };
      
      console.log('Disabling location:', updatedFormData);
      
      // Prepare payload matching API specification
      const payload = {
        locationId: updatedFormData.locationId,
        locationName: updatedFormData.locationName,
        locationType: updatedFormData.locationType,
        locationDisplayType: updatedFormData.locationDisplayType,
        active: updatedFormData.active,
        addressLine1: updatedFormData.addressLine1,
        addressLine2: updatedFormData.addressLine2,
        addressLine3: updatedFormData.addressLine3,
        city: updatedFormData.city,
        state: updatedFormData.state,
        postalCode: updatedFormData.postalCode,
        latitude: parseFloat(updatedFormData.latitude) || 0,
        longitude: parseFloat(updatedFormData.longitude) || 0,
        websiteUrl: updatedFormData.websiteUrl
      };

      const response = await fetch(getApiUrl('/producer/location'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to disable location: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Location Disabled",
        description: "Location has been successfully disabled.",
      });
      
      onLocationUpdated(updatedFormData);
      onClose();
      onDialogClose();
    } catch (error) {
      console.error('Error disabling location:', error);
      toast({
        title: "Error",
        description: "Failed to disable location. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disable Location</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to disable "{location.locationName}"? This will make the location inactive and it will no longer be visible to customers. You can re-enable it later if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDisableLocation}
            className="bg-red-600 hover:bg-red-700"
          >
            Disable Location
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DisableLocationDialog;
