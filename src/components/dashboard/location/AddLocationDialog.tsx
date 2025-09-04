
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { useApiClient } from "@/hooks/useApiClient.ts";
import { useLocationForm } from "@/hooks/useLocationForm.ts";
import LocationFormFields from "./LocationFormFields.tsx";
import { LocationFormData } from "@/types/location.ts";
import { FULL_NAME_TO_ABBREVIATION } from "@/constants/usStates.ts";

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
  const apiClient = useApiClient();

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

      // Validate required contact fields
      if (!formData.firstName?.trim()) {
        toast({
          title: "Error",
          description: "First name is required.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.lastName?.trim()) {
        toast({
          title: "Error",
          description: "Last name is required.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.phoneNumber?.trim()) {
        toast({
          title: "Error",
          description: "Phone number is required.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.emailAddress?.trim()) {
        toast({
          title: "Error",
          description: "Email address is required.",
          variant: "destructive",
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailAddress)) {
        toast({
          title: "Error",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }

      // Validate phone number format (should have exactly 10 digits)
      const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        toast({
          title: "Error",
          description: "Phone number must be 10 digits.",
          variant: "destructive",
        });
        return;
      }

      // Convert full state name to abbreviation for API
      const stateAbbreviation = FULL_NAME_TO_ABBREVIATION[formData.state] || formData.state;

      // Prepare payload matching new API specification
      const payload = {
        locationRequest: {
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
          latitude: 0,
          longitude: 0,
          websiteUrl: formData.websiteUrl
        },
        contactRequest: {
          producerContactType: "PRIMARY",
          displayContactType: formData.displayContactType || "PHONE_EMAIL_ONLY",
          genericContactName: formData.genericContactName || '',
          firstName: formData.firstName,
          lastName: formData.lastName,
          title: formData.title || '',
          phoneNumber: formData.phoneNumber,
          cellPhoneNumber: formData.cellPhoneNumber || '',
          emailAddress: formData.emailAddress,
          importFlag: false,
          notImported: false
        }
      };

      const result = await apiClient.post(`/producer/${producerId}/location`, payload);

      toast({
        title: "Location Added",
        description: "New location has been successfully added.",
      });

      onLocationAdded(result.response);
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
