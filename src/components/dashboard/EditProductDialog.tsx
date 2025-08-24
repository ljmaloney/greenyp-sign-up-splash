import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useApiClient } from '@/hooks/useApiClient';
import { updateProduct, ProductUpdateRequest, discontinueProduct } from '@/services/productService';
import { useEditProductForm } from '@/hooks/useEditProductForm';
import EditProductFormFields from './EditProductFormFields';
import { ProductResponse } from '@/services/servicesService';

interface EditProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductResponse | null;
  onProductUpdated: () => void;
}

const EditProductDialog = ({ isOpen, onClose, product, onProductUpdated }: EditProductDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const apiClient = useApiClient();
  const { formData, handleChange } = useEditProductForm(product);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setIsLoading(true);
    
    try {
      if (formData.discontinued && formData.discontinueDate && formData.lastOrderDate) {
        // If product is being discontinued with dates, use the discontinue endpoint
        await discontinueProduct({
          productId: product.productId,
          discontinueDate: formData.discontinueDate,
          lastOrderDate: formData.lastOrderDate
        });
        
        toast({
          title: "Product Discontinued",
          description: "Your product has been successfully discontinued.",
        });
      } else {
        // Otherwise, use the regular update endpoint
        const updateRequest: ProductUpdateRequest = {
          productId: product.productId,
          productType: formData.productType,
          botanicalGroup: formData.botanicalGroup,
          name: formData.name,
          price: formData.price,
          availableQuantity: formData.availableQuantity,
          containerSize: formData.containerSize,
          description: formData.description,
          discontinued: formData.discontinued,
          discontinueDate: formData.discontinued ? formData.discontinueDate : undefined,
          lastOrderDate: formData.lastOrderDate || undefined,
          attributeMap: formData.attributeMap
        };

        console.log('Updating product:', updateRequest);
        await updateProduct(updateRequest);
        
        toast({
          title: "Product Updated",
          description: "Your product has been successfully updated.",
        });
      }
      
      onProductUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: formData.discontinued && formData.discontinueDate && formData.lastOrderDate ? "Discontinue Failed" : "Update Failed",
        description: `Failed to ${formData.discontinued && formData.discontinueDate && formData.lastOrderDate ? 'discontinue' : 'update'} product. Please try again.`,
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
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <EditProductFormFields
            formData={formData}
            onFieldChange={handleChange}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className={formData.discontinued && formData.discontinueDate && formData.lastOrderDate ? "bg-red-600 hover:bg-red-700" : "bg-greenyp-600 hover:bg-greenyp-700"} 
              disabled={isLoading}
            >
              {isLoading ? 
                (formData.discontinued && formData.discontinueDate && formData.lastOrderDate ? 'Discontinuing...' : 'Updating...') : 
                (formData.discontinued && formData.discontinueDate && formData.lastOrderDate ? 'Discontinue Product' : 'Update Product')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
