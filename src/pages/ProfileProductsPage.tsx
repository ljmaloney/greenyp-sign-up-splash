
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfileData } from '@/hooks/useProfileData';
import { useProducts } from '@/hooks/useProducts';
import ProfilePageLayout from '@/components/profile/ProfilePageLayout';
import ProfileLoadingState from '@/components/profile/ProfileLoadingState';
import ProfileErrorState from '@/components/profile/ProfileErrorState';

// Product type mappings for better display
const getProductTypeDisplay = (productType: string): string => {
  const mappings: Record<string, string> = {
    'BAGGED_MATERIAL': 'Bagged Material',
    'BOTANICAL': 'Plants, Trees & Bushes',
    'BULK_MATERIAL': 'Bulk Material',
    'CONTAINERS': 'Pots & Containers',
    'DECORATIVE_STONE': 'Decorative Stone',
    'HARDWARE': 'Hardware',
    'LANDSCAPE_PRODUCTS': 'Landscape Products',
    'LANDSCAPE_TOOLS': 'Landscaping Tools',
    'POND_MAINTENANCE': 'Pond Maintenance'
  };
  
  return mappings[productType] || productType;
};

const ProfileProductsPage = () => {
  const { producerId } = useParams<{ producerId: string }>();
  const { profile, isLoading: profileLoading, error: profileError } = useProfileData();
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useProducts(profile?.locationId);

  if (profileLoading) {
    return <ProfileLoadingState />;
  }

  if (profileError && !profile) {
    return <ProfileErrorState />;
  }

  if (!profile) {
    return <ProfileErrorState />;
  }

  const products = productsResponse?.response || [];

  return (
    <ProfilePageLayout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              to={`/profile/${producerId}`}
              className="inline-flex items-center text-greenyp-600 hover:text-greenyp-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
              <p className="text-gray-600">
                Available products at {profile.locationName || profile.businessName}
              </p>
            </div>

            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-greenyp-600" />
                  Products ({products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <p className="text-gray-600">Loading products...</p>
                ) : productsError ? (
                  <p className="text-red-600">Error loading products. Please try again.</p>
                ) : products.length === 0 ? (
                  <p className="text-gray-600">No products available at this time.</p>
                ) : (
                  <div className="space-y-6">
                    {products.map((product) => (
                      <div key={product.productId} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                          <span className="text-2xl font-bold text-greenyp-600">
                            ${product.price}
                          </span>
                        </div>
                        
                        {product.description && (
                          <p className="text-gray-600 mb-3">{product.description}</p>
                        )}
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Type:</span>
                            <p className="text-gray-600">{getProductTypeDisplay(product.productType)}</p>
                          </div>
                          
                          {product.containerSize && (
                            <div>
                              <span className="font-medium text-gray-700">Size:</span>
                              <p className="text-gray-600">{product.containerSize}</p>
                            </div>
                          )}
                          
                          <div>
                            <span className="font-medium text-gray-700">Availability:</span>
                            <p className={`${product.availableQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {product.availableQuantity > 0 ? `${product.availableQuantity} available` : 'Out of Stock'}
                            </p>
                          </div>
                          
                          {product.botanicalGroup && (
                            <div>
                              <span className="font-medium text-gray-700">Group:</span>
                              <p className="text-gray-600">{product.botanicalGroup}</p>
                            </div>
                          )}
                        </div>
                        
                        {product.discontinued && (
                          <div className="mt-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Discontinued
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </ProfilePageLayout>
  );
};

export default ProfileProductsPage;
