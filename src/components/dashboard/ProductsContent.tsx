
import React from 'react';
import ProductLocationGroup from './ProductLocationGroup';
import { ProductResponse } from '@/services/servicesService';

interface ProductsContentProps {
  groupedProducts: Record<string, ProductResponse[]>;
  locations: { id: string; name: string; address: string }[];
  openGroups: Record<string, boolean>;
  onToggleGroup: (locationId: string) => void;
  onEditProduct: (product: ProductResponse) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: (locationId: string) => void;
}

const ProductsContent = ({
  groupedProducts,
  locations,
  openGroups,
  onToggleGroup,
  onEditProduct,
  onDeleteProduct,
  onAddProduct
}: ProductsContentProps) => {
  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No locations found. Please add a location first.</p>
        <a href="/dashboard/locations" className="text-blue-600 hover:underline">
          Go to Locations
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {locations.map((location) => {
        const locationProducts = groupedProducts[location.id] || [];
        const hasProducts = locationProducts.length > 0;
        
        return (
          <ProductLocationGroup
            key={location.id}
            locationId={location.id}
            locationProducts={locationProducts}
            locations={locations}
            isOpen={openGroups[location.id] || !hasProducts}
            onToggle={() => onToggleGroup(location.id)}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
            onAddProduct={onAddProduct}
            hasProducts={hasProducts}
          />
        );
      })}
    </div>
  );
};

export default ProductsContent;
