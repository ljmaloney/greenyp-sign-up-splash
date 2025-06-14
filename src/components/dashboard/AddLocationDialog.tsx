
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";
import { useLocationForm } from "@/hooks/useLocationForm";
import LocationFormFields from "./LocationFormFields";
import { LocationFormData } from "@/types/location";

interface AddLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationAdded: (location: any) => void;
}

const AddLocationDialog = ({ isOpen, onClose, onLocationAdded }: AddLocationDialogProps) => {
  const [searchParams] = useSearchParams();
  const producerId = searchParams.get('producerId');
  const { formData, handleChange, resetForm } = useLocationForm();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!producerId) {
      toast({
        title: "Error",
        description: "Producer ID is required to add a location.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('Adding new location:', formData);
      
      // Prepare payload matching API specification (exclude locationId for new locations)
      const payload = {
        locationName: formData.locationName,
        locationType: formData.locationType,
        locationDisplayType: formData.locationDisplayType,
        active: formData.active,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        addressLine3: formData.addressLine3,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        websiteUrl: formData.websiteUrl
      };
      
      const response = await fetch(getApiUrl(`/producer/${producerId}/location`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to add location: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Location Added",
        description: "New location has been successfully added.",
      });
      
      onLocationAdded(result);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error adding location:', error);
      toast({
        title: "Error",
        description: "Failed to add location. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <LocationFormFields
            formData={formData}
            onFieldChange={handleChange}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700">
              Add Location
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationDialog;
