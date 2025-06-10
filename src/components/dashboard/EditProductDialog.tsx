
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { updateProduct, ProductUpdateRequest } from '@/services/productService';

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
  const [formData, setFormData] = useState({
    productType: product?.productType || 'BAGGED_MATERIAL',
    botanicalGroup: product?.botanicalGroup || product?.category || '',
    name: product?.name || '',
    price: product?.price || 0,
    availableQuantity: product?.availableQuantity || product?.quantity || 0,
    containerSize: product?.containerSize || '',
    description: product?.description || '',
    discontinued: product?.discontinued || false,
    discontinueDate: '',
    lastOrderDate: '',
    attributeMap: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const productTypes = [
    { value: 'BAGGED_MATERIAL', label: 'Bagged Material - Bagged gravel, sand, decorative stone, mulches, etc' },
    { value: 'BOTANICAL', label: 'Botanical - Live plants, trees, shrubs, and flowers' },
    { value: 'BULK_MATERIAL', label: 'Bulk Material - Bulk gravel, soil, mulches, decorative stone, etc' },
    { value: 'CONTAINERS', label: 'Containers - Pots, starting trays, etc' },
    { value: 'DECORATIVE_STONE', label: 'Decorative Stone - Fieldstone, river rock, beach pebbles, etc' },
    { value: 'HARDWARE', label: 'Hardware - Miscellaneous hardware' },
    { value: 'LANDSCAPE_PRODUCTS', label: 'Landscape Products - Misc landscape products' },
    { value: 'LANDSCAPE_TOOLS', label: 'Landscape Tools - Landscaping tools and equipment' },
    { value: 'POND_MAINTENANCE', label: 'Pond Maintenance - Pond installation, pumps, etc' },
    { value: 'SOIL_AMENDMENTS', label: 'Soil Amendments - Soil amendments' }
  ];

  React.useEffect(() => {
    if (product) {
      setFormData({
        productType: product.productType || 'BAGGED_MATERIAL',
        botanicalGroup: product.botanicalGroup || product.category || '',
        name: product.name,
        price: product.price,
        availableQuantity: product.availableQuantity || product.quantity,
        containerSize: product.containerSize || '',
        description: product.description,
        discontinued: product.discontinued || false,
        discontinueDate: '',
        lastOrderDate: '',
        attributeMap: {}
      });
    }
  }, [product]);

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

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type
            </label>
            <Select value={formData.productType} onValueChange={(value) => handleChange('productType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
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
              Botanical Group (Genus and Species)
            </label>
            <Input
              value={formData.botanicalGroup}
              onChange={(e) => handleChange('botanicalGroup', e.target.value)}
              placeholder="e.g., Acer palmatum, Rosa damascena"
              disabled={formData.productType !== 'BOTANICAL'}
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="discontinued"
              checked={formData.discontinued}
              onCheckedChange={(checked) => handleChange('discontinued', checked as boolean)}
            />
            <label htmlFor="discontinued" className="text-sm font-medium text-gray-700">
              Mark as discontinued
            </label>
          </div>

          {formData.discontinued && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discontinue Date
              </label>
              <Input
                type="date"
                value={formData.discontinueDate}
                onChange={(e) => handleChange('discontinueDate', e.target.value)}
              />
            </div>
          )}
          
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
