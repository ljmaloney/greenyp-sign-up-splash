
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateProduct, ProductUpdateRequest } from '@/services/productService';
import { useEditProductForm } from '@/hooks/useEditProductForm';
import EditProductFormFields from './EditProductFormFields';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
  productType?: string;
  botanicalGroup?: string;
  containerSize?: string;
  availableQuantity?: number;
  discontinued?: boolean;
}

interface EditProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onProductUpdated: () => void;
}

const EditProductDialog = ({ isOpen, onClose, product, onProductUpdated }: EditProductDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { formData, handleChange } = useEditProductForm(product);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setIsLoading(true);
    
    try {
      const updateRequest: ProductUpdateRequest = {
        productId: product.id,
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
      
      onProductUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update product. Please try again.",
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
            <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
