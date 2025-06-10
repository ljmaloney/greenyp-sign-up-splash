
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createProduct, ProductCreateRequest } from '@/services/productService';
import { useProductForm } from '@/hooks/useProductForm';
import ProductFormFields from './ProductFormFields';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { formData, handleChange, resetForm } = useProductForm(preSelectedLocationId);

  // Mock locations data
  const locations: Location[] = [
    { id: '1', name: 'Main Office', address: '123 Garden Street, San Francisco, CA 94102' },
    { id: '2', name: 'Warehouse', address: '456 Industrial Blvd, San Francisco, CA 94103' }
  ];

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
      resetForm();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <ProductFormFields
            formData={formData}
            onFieldChange={handleChange}
            locations={locations}
          />
          
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
