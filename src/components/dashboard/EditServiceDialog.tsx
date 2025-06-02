
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateService, ServiceUpdateRequest } from '@/services/serviceService';

interface Service {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  priceUnit: string;
  description: string;
}

interface EditServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onServiceUpdated: () => void;
}

const EditServiceDialog = ({ isOpen, onClose, service, onServiceUpdated }: EditServiceDialogProps) => {
  const [formData, setFormData] = useState({
    shortDescription: service?.name || '',
    description: service?.description || '',
    minServicePrice: service?.minPrice || 0,
    maxServicePrice: service?.maxPrice || 0,
    priceUnitsType: 'PER_VISIT',
    serviceTerms: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (service) {
      setFormData({
        shortDescription: service.name,
        description: service.description,
        minServicePrice: service.minPrice,
        maxServicePrice: service.maxPrice,
        priceUnitsType: 'PER_VISIT',
        serviceTerms: ''
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    
    setIsLoading(true);
    
    try {
      const updateRequest: ServiceUpdateRequest = {
        producerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        producerLocationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        minServicePrice: formData.minServicePrice,
        maxServicePrice: formData.maxServicePrice,
        priceUnitsType: formData.priceUnitsType,
        shortDescription: formData.shortDescription,
        description: formData.description,
        serviceTerms: formData.serviceTerms
      };

      console.log('Updating service:', updateRequest);
      await updateService(service.id, updateRequest);
      
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

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <Input
              value={formData.shortDescription}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price ($)
              </label>
              <Input
                type="number"
                value={formData.minServicePrice}
                onChange={(e) => handleChange('minServicePrice', Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price ($)
              </label>
              <Input
                type="number"
                value={formData.maxServicePrice}
                onChange={(e) => handleChange('maxServicePrice', Number(e.target.value))}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Terms
            </label>
            <Textarea
              value={formData.serviceTerms}
              onChange={(e) => handleChange('serviceTerms', e.target.value)}
              rows={2}
              placeholder="Terms and conditions for this service"
            />
          </div>
          
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
