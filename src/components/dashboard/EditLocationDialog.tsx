
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/config/api";
import { useLocationForm } from "@/hooks/useLocationForm";
import LocationFormFields from "./LocationFormFields";
import { Location } from "@/services/locationService";
import { LocationFormData } from "@/types/location";

interface EditLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location;
  onLocationUpdated: (location: LocationFormData) => void;
}

const EditLocationDialog = ({ isOpen, onClose, location, onLocationUpdated }: EditLocationDialogProps) => {
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const { formData, handleChange } = useLocationForm({
    locationId: location.locationId,
    locationName: location.locationName,
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

  const handleDisableLocation = async () => {
    try {
      const updatedFormData = { ...formData, active: false };
      
      console.log('Disabling location:', updatedFormData);
      
      const response = await fetch(getApiUrl('/producer/location'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
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
      setIsDisableDialogOpen(false);
      onClose();
    } catch (error) {
      console.error('Error disabling location:', error);
      toast({
        title: "Error",
        description: "Failed to disable location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const canDisableLocation = location.active && location.locationType !== 'HOME_OFFICE_PRIMARY';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <LocationFormFields
              formData={formData}
              onFieldChange={handleChange}
            />
            
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                {canDisableLocation && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => setIsDisableDialogOpen(true)}
                  >
                    Disable Location
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700">
                  Update Location
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
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
    </>
  );
};

export default EditLocationDialog;
