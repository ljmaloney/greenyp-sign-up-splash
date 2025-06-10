import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createService, ServiceCreateRequest } from '@/services/serviceService';

interface AddServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceCreated: () => void;
  preSelectedLocationId?: string;
}

const AddServiceDialog = ({ isOpen, onClose, onServiceCreated, preSelectedLocationId }: AddServiceDialogProps) => {
  const [formData, setFormData] = useState({
    shortDescription: '',
    description: '',
    minServicePrice: 0,
    maxServicePrice: 0,
    priceUnitsType: 'LOT_SIZE',
    serviceTerms: '',
    producerLocationId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock locations data - in a real app, this would come from an API
  const locations = [
    { id: '1', name: 'Main Office', address: '123 Garden Street, San Francisco, CA 94102' },
    { id: '2', name: 'Warehouse', address: '456 Industrial Blvd, San Francisco, CA 94103' }
  ];

  // Update form data when preSelectedLocationId changes
  useEffect(() => {
    if (preSelectedLocationId) {
      setFormData(prev => ({ ...prev, producerLocationId: preSelectedLocationId }));
    }
  }, [preSelectedLocationId]);

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
      
      // Reset form
      setFormData({
        shortDescription: '',
        description: '',
        minServicePrice: 0,
        maxServicePrice: 0,
        priceUnitsType: 'LOT_SIZE',
        serviceTerms: '',
        producerLocationId: preSelectedLocationId || ''
      });
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

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Select value={formData.producerLocationId} onValueChange={(value) => handleChange('producerLocationId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    <div>
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-gray-500">{location.address}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              Price Units Type
            </label>
            <Select value={formData.priceUnitsType} onValueChange={(value) => handleChange('priceUnitsType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select price unit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOT_SIZE">Lot Size</SelectItem>
                <SelectItem value="PER_VISIT">Per Visit</SelectItem>
                <SelectItem value="PER_HOUR">Per Hour</SelectItem>
                <SelectItem value="PER_PROJECT">Per Project</SelectItem>
              </SelectContent>
            </Select>
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
              {isLoading ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceDialog;
