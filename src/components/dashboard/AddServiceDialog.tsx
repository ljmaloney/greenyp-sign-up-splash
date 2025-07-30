
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useApiClient } from '@/hooks/useApiClient';
import { createService, ServiceCreateRequest } from '@/services/serviceService';
import { useServiceForm } from '@/hooks/useServiceForm';
import { useLocationCache } from '@/hooks/useLocationCache';
import { useAccountData } from '@/hooks/useAccountData';
import ServiceFormFields from './ServiceFormFields';

interface AddServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceCreated: () => void;
  preSelectedLocationId?: string;
}

const AddServiceDialog = ({ isOpen, onClose, onServiceCreated, preSelectedLocationId }: AddServiceDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const apiClient = useApiClient();
  const { locations, isLoading: locationsLoading } = useLocationCache();
  const { data: accountData } = useAccountData();
  const { formData, handleChange, resetForm } = useServiceForm(preSelectedLocationId);

  // Get producerId from account data
  const producerId = accountData?.producer?.producerId;

  // Auto-select location if there's only one and no pre-selected location
  useEffect(() => {
    if (locations.length === 1 && !preSelectedLocationId && !formData.producerLocationId) {
      handleChange('producerLocationId', locations[0].locationId);
    }
  }, [locations, preSelectedLocationId, formData.producerLocationId, handleChange]);

  // Transform locations to match the expected format
  const formattedLocations = locations.map(location => ({
    id: location.locationId,
    name: location.locationName,
    address: `${location.addressLine1}, ${location.city}, ${location.state} ${location.postalCode}`
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!producerId) {
      toast({
        title: "Profile Required",
        description: "Producer profile not found. Please ensure you're logged in.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.producerLocationId) {
      toast({
        title: "Location Required",
        description: "Please select a location for this service.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const createRequest: ServiceCreateRequest = {
        producerId: producerId,
        producerLocationId: formData.producerLocationId,
        minServicePrice: formData.minServicePrice,
        maxServicePrice: formData.maxServicePrice,
        priceUnitsType: formData.priceUnitsType,
        shortDescription: formData.shortDescription,
        description: formData.description,
        serviceTerms: formData.serviceTerms
      };

      console.log('Creating service:', createRequest);
      await createService(apiClient, createRequest);
      
      toast({
        title: "Service Created",
        description: "Your service has been successfully created.",
      });
      
      onServiceCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: "Create Failed",
        description: "Failed to create service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (locationsLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <p className="text-gray-600">Loading locations...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (formattedLocations.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <p className="text-gray-600 mb-4">No locations found. Please add a location first.</p>
            <Button onClick={onClose} variant="outline">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <ServiceFormFields
            formData={formData}
            onFieldChange={handleChange}
            locations={formattedLocations}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceDialog;
