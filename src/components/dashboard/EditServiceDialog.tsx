
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateService, ServiceUpdateRequest } from '@/services/serviceService';
import { useEditServiceForm } from '@/hooks/useEditServiceForm';
import EditServiceFormFields from './EditServiceFormFields';
import { ServiceResponse } from '@/services/servicesService';

interface EditServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceResponse | null;
  onServiceUpdated: () => void;
}

const EditServiceDialog = ({ isOpen, onClose, service, onServiceUpdated }: EditServiceDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { formData, handleChange } = useEditServiceForm(service);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    
    setIsLoading(true);
    
    try {
      const updateRequest: ServiceUpdateRequest = {
        serviceId: service.producerServiceId,
        minServicePrice: formData.minServicePrice,
        maxServicePrice: formData.maxServicePrice,
        priceUnitsType: formData.priceUnitsType,
        shortDescription: formData.shortDescription,
        description: formData.description,
        serviceTerms: formData.serviceTerms
      };

      console.log('Updating service:', updateRequest);
      await updateService(updateRequest);
      
      toast({
        title: "Service Updated", 
        description: "Your service has been successfully updated.",
      });
      
      onServiceUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update service. Please try again.",
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
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <EditServiceFormFields
            formData={formData}
            onFieldChange={handleChange}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceDialog;
