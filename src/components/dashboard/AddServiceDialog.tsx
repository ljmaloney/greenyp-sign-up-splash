
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createService, ServiceCreateRequest } from '@/services/serviceService';
import { useServiceForm } from '@/hooks/useServiceForm';
import ServiceFormFields from './ServiceFormFields';

interface Location {
  id: string;
  name: string;
  address: string;
}

interface AddServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceCreated: () => void;
  preSelectedLocationId?: string;
}

const AddServiceDialog = ({ isOpen, onClose, onServiceCreated, preSelectedLocationId }: AddServiceDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { formData, handleChange, resetForm } = useServiceForm(preSelectedLocationId);

  // Mock locations data - in a real app, this would come from an API
  const locations: Location[] = [
    { id: '1', name: 'Main Office', address: '123 Garden Street, San Francisco, CA 94102' },
    { id: '2', name: 'Warehouse', address: '456 Industrial Blvd, San Francisco, CA 94103' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        producerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        producerLocationId: formData.producerLocationId,
        minServicePrice: formData.minServicePrice,
        maxServicePrice: formData.maxServicePrice,
        priceUnitsType: formData.priceUnitsType,
        shortDescription: formData.shortDescription,
        description: formData.description,
        serviceTerms: formData.serviceTerms
      };

      console.log('Creating service:', createRequest);
      await createService(createRequest);
      
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
            locations={locations}
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
