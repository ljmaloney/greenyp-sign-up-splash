import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createProduct, ProductCreateRequest } from '@/services/productService';

interface Location {
  id: string;
  name: string;
  address: string;
}

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: () => void;
  preSelectedLocationId?: string;
}

const AddProductDialog = ({ isOpen, onClose, onProductCreated, preSelectedLocationId }: AddProductDialogProps) => {
  const [formData, setFormData] = useState({
    producerLocationId: '',
    productType: 'BAGGED_MATERIAL',
    botanicalGroup: '',
    name: '',
    price: 0,
    availableQuantity: 0,
    containerSize: '',
    description: '',
    attributes: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock locations data
  const locations: Location[] = [
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
        description: "Please select a location for this product.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const createRequest: ProductCreateRequest = {
        producerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        producerLocationId: formData.producerLocationId,
        productType: formData.productType,
        botanicalGroup: formData.botanicalGroup,
        name: formData.name,
        price: formData.price,
        availableQuantity: formData.availableQuantity,
        containerSize: formData.containerSize,
        description: formData.description,
        attributes: formData.attributes
      };

      console.log('Creating product:', createRequest);
      await createProduct(createRequest);
      
      toast({
        title: "Product Created",
        description: "Your product has been successfully created.",
      });
      
      onProductCreated();
      onClose();
      
      // Reset form
      setFormData({
        producerLocationId: preSelectedLocationId || '',
        productType: 'BAGGED_MATERIAL',
        botanicalGroup: '',
        name: '',
        price: 0,
        availableQuantity: 0,
        containerSize: '',
        description: '',
        attributes: {}
      });
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create product. Please try again.",
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
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
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
              Product Type
            </label>
            <Select value={formData.productType} onValueChange={(value) => handleChange('productType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BAGGED_MATERIAL">Bagged Material</SelectItem>
                <SelectItem value="PLANT">Plant</SelectItem>
                <SelectItem value="TOOL">Tool</SelectItem>
                <SelectItem value="FERTILIZER">Fertilizer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Botanical Group
            </label>
            <Input
              value={formData.botanicalGroup}
              onChange={(e) => handleChange('botanicalGroup', e.target.value)}
              placeholder="e.g., Perennials, Annuals"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Container Size
            </label>
            <Input
              value={formData.containerSize}
              onChange={(e) => handleChange('containerSize', e.target.value)}
              placeholder="e.g., 1 gallon, 25lb bag"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Quantity *
              </label>
              <Input
                type="number"
                value={formData.availableQuantity}
                onChange={(e) => handleChange('availableQuantity', Number(e.target.value))}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
