
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProductsResponse } from '@/types/profile';

interface ProfileProductsProps {
  products: ProductsResponse | null;
  hasFeature: (featureName: string) => boolean;
}

const ProfileProducts = ({ products, hasFeature }: ProfileProductsProps) => {
  if (!hasFeature('products') || !products || products.response.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Products
          <span className="text-sm font-normal text-gray-500">
            {products.response.length} item{products.response.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.response.slice(0, 6).map((product) => (
            <div key={product.productId} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <p className="text-gray-600 mt-1">{product.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Type: {product.productType.replace('_', ' ')}</span>
                    {product.containerSize && <span>Size: {product.containerSize}</span>}
                    {product.availableQuantity > 0 && <span>Available: {product.availableQuantity}</span>}
                  </div>
                </div>
                {product.price > 0 && (
                  <div className="text-right ml-4">
                    <span className="text-lg font-bold text-greenyp-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {products.response.length > 6 && (
          <div className="text-center mt-6">
            <Button variant="outline" className="border-greenyp-600 text-greenyp-600 hover:bg-greenyp-50">
              View All Products ({products.response.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileProducts;
