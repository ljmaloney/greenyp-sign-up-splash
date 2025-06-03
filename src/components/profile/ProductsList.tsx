
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/profile';

interface ProductsListProps {
  locationId: string;
}

// Mock products data for validation
const mockProducts: Product[] = [
  {
    productId: 'prod-001',
    createDate: '2024-01-15',
    lastUpdateDate: '2024-05-15',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    productType: 'BOTANICAL',
    botanicalGroup: 'Trees',
    name: 'Red Oak Tree - 8ft',
    price: 149.99,
    availableQuantity: 25,
    containerSize: '25 gallon',
    description: 'Beautiful mature red oak tree, perfect for providing shade and adding value to your property. Drought resistant once established.',
    discontinued: false,
    discontinueDate: '',
    lastOrderDate: '2024-05-10',
    attributes: {}
  },
  {
    productId: 'prod-002',
    createDate: '2024-02-01',
    lastUpdateDate: '2024-05-20',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    productType: 'BAGGED_MATERIAL',
    botanicalGroup: 'Soil & Amendments',
    name: 'Premium Potting Soil',
    price: 12.99,
    availableQuantity: 200,
    containerSize: '50 lb bag',
    description: 'Nutrient-rich potting soil blend perfect for containers, raised beds, and garden plantings.',
    discontinued: false,
    discontinueDate: '',
    lastOrderDate: '2024-05-18',
    attributes: {}
  },
  {
    productId: 'prod-003',
    createDate: '2024-03-10',
    lastUpdateDate: '2024-05-25',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    productType: 'DECORATIVE_STONE',
    botanicalGroup: 'Hardscape Materials',
    name: 'Desert Rose Decorative Rock',
    price: 89.99,
    availableQuantity: 50,
    containerSize: '1 ton',
    description: 'Beautiful pink and red decorative stone perfect for xeriscaping and modern landscape designs.',
    discontinued: false,
    discontinueDate: '',
    lastOrderDate: '2024-05-22',
    attributes: {}
  },
  {
    productId: 'prod-004',
    createDate: '2024-01-20',
    lastUpdateDate: '2024-04-30',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    productType: 'BOTANICAL',
    botanicalGroup: 'Perennials',
    name: 'Desert Marigold',
    price: 8.99,
    availableQuantity: 75,
    containerSize: '1 gallon',
    description: 'Bright yellow flowering perennial that blooms almost year-round in desert climates. Low water requirements.',
    discontinued: false,
    discontinueDate: '',
    lastOrderDate: '2024-05-15',
    attributes: {}
  },
  {
    productId: 'prod-005',
    createDate: '2024-02-15',
    lastUpdateDate: '2024-03-01',
    producerId: 'producer-001',
    producerLocationId: 'location-001',
    productType: 'LANDSCAPE_TOOLS',
    botanicalGroup: 'Tools & Equipment',
    name: 'Professional Pruning Shears',
    price: 45.99,
    availableQuantity: 0,
    containerSize: 'Each',
    description: 'High-quality steel pruning shears with ergonomic grip. Perfect for maintaining shrubs and small trees.',
    discontinued: true,
    discontinueDate: '2024-03-01',
    lastOrderDate: '2024-02-28',
    attributes: {}
  }
];

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

  // Use mock data if API fails or returns no products
  const products = productsResponse?.response?.length > 0 ? productsResponse.response : mockProducts;

  if (!products || products.length === 0) {
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsList;
