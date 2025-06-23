
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import type { ProducerProfile } from '@/types/profile';

interface ProfileProductsCardProps {
  profile: ProducerProfile;
}

const ProfileProductsCard = ({ profile }: ProfileProductsCardProps) => {
  const { data: subscriptions } = useSubscriptions();
  const { data: productsResponse, isLoading } = useProducts(profile.producerId, profile.locationId);

  // Check if any of the profile's subscriptions have products feature
  const hasProductsFeature = profile.subscriptionIds.some(subscriptionId => {
    const subscription = subscriptions?.find(sub => sub.subscriptionId === subscriptionId);
    return subscription?.features.some(feature => feature.feature === 'products');
  });

  if (!hasProductsFeature) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-greenyp-600">
            <Package className="w-5 h-5" />
            Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Loading products...</p>
        </CardContent>
      </Card>
    );
  }

  const products = productsResponse?.response || [];
  const displayProducts = products.slice(0, 5);
  const hasMoreProducts = products.length > 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-greenyp-600">
          <Package className="w-5 h-5" />
          Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayProducts.length > 0 ? (
          <div className="space-y-3">
            {displayProducts.map((product) => (
              <div key={product.productId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="text-left">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  {product.description && (
                    <p className="text-sm text-gray-600">{product.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${product.price}</p>
                </div>
              </div>
            ))}
            {hasMoreProducts && (
              <div className="pt-3">
                <Link 
                  to={`/profile/${profile.producerId}/${profile.locationId}/products`}
                  className="text-greenyp-600 hover:text-greenyp-700 underline"
                >
                  More ....
                </Link>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No products available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileProductsCard;
