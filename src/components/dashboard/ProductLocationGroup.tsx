
import React from 'react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, ChevronDown, ChevronUp, Plus, Edit, Trash2 } from 'lucide-react';
import { ProductResponse } from '@/services/servicesService';

interface ProductLocationGroupProps {
  locationId: string;
  locationProducts: ProductResponse[];
  locations: { id: string; name: string; address: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onEditProduct: (product: ProductResponse) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: (locationId: string) => void;
  hasProducts: boolean;
}

const ProductLocationGroup = ({ 
  locationId, 
  locationProducts, 
  locations, 
  isOpen, 
  onToggle, 
  onEditProduct, 
  onDeleteProduct,
  onAddProduct,
  hasProducts
}: ProductLocationGroupProps) => {
  const getLocationName = (locationId?: string) => {
    if (!locationId) return 'No Location';
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown Location';
  };

  const locationName = getLocationName(locationId === 'no-location' ? undefined : locationId);
  const hasMultipleProducts = locationProducts.length > 1;

  const getProductTypeDisplay = (productType: string): string => {
    const mappings: Record<string, string> = {
      'BAGGED_MATERIAL': 'Bagged Material',
      'BOTANICAL': 'Plants, Trees & Shrubs',
      'BULK_MATERIAL': 'Bulk Material',
      'CONTAINERS': 'Pots & Containers',
      'DECORATIVE_STONE': 'Decorative Stone',
      'HARDWARE': 'Hardware',
      'LANDSCAPE_PRODUCTS': 'Landscape Products',
      'LANDSCAPE_TOOLS': 'Landscaping Tools',
      'POND_MAINTENANCE': 'Pond Maintenance',
      'SOIL_AMENDMENTS': 'Soil Amendments'
    };
    
    return mappings[productType] || productType;
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <Collapsible open={isOpen} onOpenChange={() => hasMultipleProducts && onToggle()}>
        <div className="bg-greenyp-50 p-4 border-b border-greenyp-100">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <div className={`flex items-center flex-1 ${hasMultipleProducts ? 'cursor-pointer' : 'cursor-default'}`}>
                <MapPin className="w-4 h-4 mr-2 text-greenyp-600" />
                <h3 className="font-semibold text-gray-900">{locationName}</h3>
                <span className="ml-2 text-sm text-gray-500">
                  ({locationProducts.length} product{locationProducts.length !== 1 ? 's' : ''})
                </span>
                {hasMultipleProducts && (
                  <div className="ml-2">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                  </div>
                )}
              </div>
            </CollapsibleTrigger>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAddProduct(locationId)}
              className="ml-4 bg-greenyp-700 hover:bg-greenyp-800 text-white border-greenyp-700 hover:border-greenyp-800"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <CollapsibleContent>
          <div className="divide-y bg-white">
            {!hasProducts ? (
              <div className="p-4 text-center">
                <p className="text-gray-500">No Products Configured</p>
              </div>
            ) : (
              locationProducts.map((product) => (
                <div key={product.productId} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <span className="text-lg font-semibold text-greenyp-600">
                          ${product.price}
                        </span>
                      </div>
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>Type: {getProductTypeDisplay(product.productType)}</span>
                        {product.containerSize && (
                          <span>Size: {product.containerSize}</span>
                        )}
                        {product.availableQuantity > 0 ? (
                          <span>Available: {product.availableQuantity}</span>
                        ) : (
                          <span className="text-red-600">Out of Stock</span>
                        )}
                        {product.botanicalGroup && (
                          <span>Group: {product.botanicalGroup}</span>
                        )}
                        {product.discontinued && (
                          <span className="text-red-600">Discontinued</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditProduct(product)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteProduct(product.productId)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ProductLocationGroup;
