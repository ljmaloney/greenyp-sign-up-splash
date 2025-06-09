
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";
import { useLocationForm } from "@/hooks/useLocationForm";
import LocationFormFields from "./LocationFormFields";
import { Location, LocationFormData } from "@/types/location";

interface EditLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location;
  onLocationUpdated: (location: LocationFormData) => void;
}

const EditLocationDialog = ({ isOpen, onClose, location, onLocationUpdated }: EditLocationDialogProps) => {
  const { formData, handleChange } = useLocationForm({
    locationId: location.id,
    locationName: location.name,
    locationType: location.locationType,
    locationDisplayType: location.locationDisplayType,
    active: location.active,
    addressLine1: location.addressLine1,
    addressLine2: location.addressLine2 || '',
    addressLine3: location.addressLine3 || '',
    city: location.city,
    state: location.state,
    postalCode: location.postalCode,
    latitude: location.latitude,
    longitude: location.longitude,
    websiteUrl: location.websiteUrl || ''
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Updating location:', formData);
      
      const response = await fetch(getApiUrl('/producer/location'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <LocationFormFields
            formData={formData}
            onFieldChange={handleChange}
            showActiveToggle={true}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700">
              Update Location
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLocationDialog;
