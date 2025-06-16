
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocationForm } from "@/hooks/useLocationForm";
import { Location } from "@/services/locationService";
import { LocationFormData } from "@/types/location";
import { STATE_ABBREVIATIONS } from "@/constants/usStates";
import EditLocationForm from "./EditLocationForm";
import EditLocationActions from "./EditLocationActions";
import DisableLocationDialog from "./DisableLocationDialog";

interface EditLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location;
  onLocationUpdated: (location: LocationFormData) => void;
}

const EditLocationDialog = ({ isOpen, onClose, location, onLocationUpdated }: EditLocationDialogProps) => {
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  
  // Convert state abbreviation to full name for display
  const displayState = STATE_ABBREVIATIONS[location.state] || location.state;
  
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
    state: displayState,
    postalCode: location.postalCode,
    latitude: location.latitude,
    longitude: location.longitude,
    websiteUrl: location.websiteUrl || ''
  });

  const handleDisableDialogOpen = () => {
    setIsDisableDialogOpen(true);
  };

  const handleDisableDialogClose = () => {
    setIsDisableDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
          </DialogHeader>
          
          <EditLocationForm
            formData={formData}
            onFieldChange={handleChange}
            location={location}
            onLocationUpdated={onLocationUpdated}
            onClose={onClose}
          >
            <EditLocationActions
              location={location}
              onClose={onClose}
              onDisableLocation={handleDisableDialogOpen}
            />
          </EditLocationForm>
        </DialogContent>
      </Dialog>

      <DisableLocationDialog
        isOpen={isDisableDialogOpen}
        onClose={handleDisableDialogClose}
        location={location}
        formData={formData}
        onLocationUpdated={onLocationUpdated}
        onDialogClose={onClose}
      />
    </>
  );
};

export default EditLocationDialog;
