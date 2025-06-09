
import React from 'react';
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
  const { formData, handleChange, resetForm } = useLocationForm();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Adding new location:', formData);
      
      const response = await fetch(getApiUrl('/producer/location'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
