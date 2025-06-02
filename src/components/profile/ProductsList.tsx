
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

interface ProductsListProps {
  locationId: string;
}

const ProductsList = ({ locationId }: ProductsListProps) => {
  const { data: productsResponse, isLoading, error } = useProducts(locationId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-greenyp-600" />
            Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Loading products...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !productsResponse?.response) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-greenyp-600" />
            Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No products available at this time.</p>
        </CardContent>
      </Card>
    );
  }

  const products = productsResponse.response;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="w-5 h-5 mr-2 text-greenyp-600" />
          Products ({products.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.productId} className="border-b border-gray-200 pb-4 last:border-b-0">
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
                {product.containerSize && (
                  <span>Size: {product.containerSize}</span>
                )}
                {product.availableQuantity > 0 && (
                  <span>Available: {product.availableQuantity}</span>
                )}
                {product.botanicalGroup && (
                  <span>Group: {product.botanicalGroup}</span>
                )}
                {product.discontinued && (
                  <span className="text-red-600">Discontinued</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsList;
