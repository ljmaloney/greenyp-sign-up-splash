import React, { useState, useEffect, useMemo } from 'react';
import EditProductDialog from './EditProductDialog';
import AddProductDialog from './AddProductDialog';
import DeleteServiceDialog from './DeleteServiceDialog';
import ProductsHeader from './ProductsHeader';
import ProductsContent from './ProductsContent';
import { useProductsWithLocationCache } from '@/hooks/useProductsWithLocationCache';
import { ProductResponse } from '@/services/servicesService';

const DashboardProductsList = () => {
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [preSelectedLocationId, setPreSelectedLocationId] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const {
    locations,
    groupedProducts,
    isLoading,
    error,
    refetch,
    producerId
  } = useProductsWithLocationCache();

  // Memoize the location IDs to prevent infinite re-renders
  const locationIds = useMemo(() => 
    locations.map(location => location.id),
    [locations]
  );

  // Auto-open all location groups when locations are loaded
  useEffect(() => {
    if (locationIds.length > 0) {
      const allOpen = locationIds.reduce((acc, locationId) => {
        acc[locationId] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setOpenGroups(allOpen);
    }
  }, [locationIds]);

  const handleEdit = (product: ProductResponse) => {
    setEditingProduct(product);
  };

  const handleDelete = async () => {
    if (!deletingProductId) return;
    
    setIsDeleting(true);
    try {
      // Delete product logic here
      console.log('Deleting product:', deletingProductId);
      await refetch();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
      setDeletingProductId(null);
    }
  };

  const handleProductUpdated = () => {
    refetch();
    setEditingProduct(null);
  };

  const handleProductCreated = () => {
    refetch();
  };

  const handleAddProduct = (locationId: string) => {
    setPreSelectedLocationId(locationId);
    setIsAddingProduct(true);
  };

  const toggleGroup = (locationId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [locationId]: !prev[locationId]
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ProductsHeader />
        <div className="text-center py-8">
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ProductsHeader />
        <div className="text-center py-8">
          <p className="text-red-600">Error loading products. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductsHeader />

      <ProductsContent
        groupedProducts={groupedProducts}
        locations={locations}
        openGroups={openGroups}
        onToggleGroup={toggleGroup}
        onEditProduct={handleEdit}
        onDeleteProduct={(productId) => setDeletingProductId(productId)}
        onAddProduct={handleAddProduct}
      />

      <AddProductDialog
        isOpen={isAddingProduct}
        onClose={() => {
          setIsAddingProduct(false);
          setPreSelectedLocationId('');
        }}
        onProductCreated={handleProductCreated}
        preSelectedLocationId={preSelectedLocationId}
        locations={locations}
        producerId={producerId || ''}
      />

      <EditProductDialog
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        onProductUpdated={handleProductUpdated}
      />

      <DeleteServiceDialog
        isOpen={!!deletingProductId}
        isDeleting={isDeleting}
        onClose={() => setDeletingProductId(null)}
        onConfirm={handleDelete}
        serviceId={deletingProductId}
      />
    </div>
  );
};

export default DashboardProductsList;
