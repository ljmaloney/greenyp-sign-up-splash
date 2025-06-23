
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { useProducerProfile } from '@/hooks/useProfile';
import ProfilePageLayout from '@/components/profile/ProfilePageLayout';

const ProductsPage = () => {
  const { producerId, producerLocationId } = useParams<{ 
    producerId: string;
    producerLocationId: string; 
  }>();
  
  const { data: profileResponse } = useProducerProfile(producerLocationId!);
  const { data: productsResponse, isLoading, error } = useProducts(producerId, producerLocationId);

  const profile = profileResponse?.response;
  const products = productsResponse?.response || [];

  if (isLoading) {
    return (
      <ProfilePageLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <p className="text-gray-600">Loading products...</p>
        </div>
      </ProfilePageLayout>
    );
  }

  if (error) {
    return (
      <ProfilePageLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <p className="text-red-600">Error loading products</p>
        </div>
      </ProfilePageLayout>
    );
  }

  return (
    <ProfilePageLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link to={`/profile/${producerId}/${producerLocationId}`}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {profile?.businessName || 'Business'} Products
          </h1>
          {profile?.locationName && profile.locationName !== profile.businessName && (
            <p className="text-lg text-gray-600">{profile.locationName}</p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-greenyp-600">
              <Package className="w-5 h-5" />
              All Products ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.productId} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
                    <div className="text-left flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      )}
                      {product.containerSize && (
                        <p className="text-xs text-gray-500">Container Size: {product.containerSize}</p>
                      )}
                      {product.availableQuantity > 0 && (
                        <p className="text-xs text-gray-500">Available: {product.availableQuantity}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium text-gray-900 text-lg">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No products available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ProfilePageLayout>
  );
};

export default ProductsPage;
