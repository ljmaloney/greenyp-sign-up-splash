import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateService, ServiceUpdateRequest } from '@/services/serviceService';
import { ServiceResponse } from '@/services/servicesService';

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
  service: ServiceResponse | null;
  onServiceUpdated: () => void;
}

const EditServiceDialog = ({ isOpen, onClose, service, onServiceUpdated }: EditServiceDialogProps) => {
  const [formData, setFormData] = useState({
    shortDescription: service?.shortDescription || '',
    description: service?.description || '',
    minServicePrice: service?.minServicePrice || 0,
    maxServicePrice: service?.maxServicePrice || 0,
    priceUnitsType: service?.priceUnitsType || 'PER_VISIT' as const,
    serviceTerms: service?.serviceTerms || '',
    producerLocationId: service?.producerLocationId || '1' // Default to first location
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock locations data - in a real app, this would come from an API
  const locations = [
    { id: '1', name: 'Main Office', address: '123 Garden Street, San Francisco, CA 94102' },
    { id: '2', name: 'Warehouse', address: '456 Industrial Blvd, San Francisco, CA 94103' }
  ];

  React.useEffect(() => {
    if (service) {
      setFormData({
        shortDescription: service.shortDescription,
        description: service.description,
        minServicePrice: service.minServicePrice,
        maxServicePrice: service.maxServicePrice,
        priceUnitsType: service.priceUnitsType,
        serviceTerms: service.serviceTerms,
        producerLocationId: service.producerLocationId || '1'
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    
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
      const updateRequest: ServiceUpdateRequest = {
        producerId: service.producerId,
        producerLocationId: formData.producerLocationId,
        minServicePrice: formData.minServicePrice,
        maxServicePrice: formData.maxServicePrice,
        priceUnitsType: formData.priceUnitsType,
        shortDescription: formData.shortDescription,
        description: formData.description,
        serviceTerms: formData.serviceTerms
      };

      console.log('Updating service:', updateRequest);
      await updateService(service.producerServiceId, updateRequest);
      
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
          
          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Units Type
              </label>
              <Select value={formData.priceUnitsType} onValueChange={(value) => handleChange('priceUnitsType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select price unit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOT_SIZE">
                    <div>
                      <div className="font-medium">Lot size</div>
                      <div className="text-sm text-gray-500">Priced based on size of lot</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="PER_HOUR">
                    <div>
                      <div className="font-medium">Per hour</div>
                      <div className="text-sm text-gray-500">Price based on time in hour increments</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="PER_MILE">
                    <div>
                      <div className="font-medium">Per mile</div>
                      <div className="text-sm text-gray-500">Price based on number of loaded miles</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="PER_MILE_RANGE">
                    <div>
                      <div className="font-medium">Per mile (range)</div>
                      <div className="text-sm text-gray-500">Price based on a range of miles</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="PER_VISIT">
                    <div>
                      <div className="font-medium">Per visit</div>
                      <div className="text-sm text-gray-500">Price per visit</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="FIXED_ESTIMATE">
                    <div>
                      <div className="font-medium">Estimate</div>
                      <div className="text-sm text-gray-500">Priced determined per contract after estimate</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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
