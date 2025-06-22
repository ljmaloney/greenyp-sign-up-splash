
import React, { useState, useEffect, useMemo } from 'react';
import EditProductDialog from './EditProductDialog';
import AddProductDialog from './AddProductDialog';
import DeleteServiceDialog from './DeleteServiceDialog';
import DiscontinueProductDialog from './DiscontinueProductDialog';
import ProductsHeader from './ProductsHeader';
import ProductsContent from './ProductsContent';
import { useProductsWithLocationCache } from '@/hooks/useProductsWithLocationCache';
import { ProductResponse } from '@/services/servicesService';

const DashboardProductsList = () => {
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [discontinuingProduct, setDiscontinuingProduct] = useState<ProductResponse | null>(null);
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

  // Auto-open all location groups when locations are loaded
  useEffect(() => {
    if (locations.length > 0) {
      const allOpen = locations.reduce((acc, location) => {
        acc[location.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setOpenGroups(allOpen);
    }
  }, [locations.length]); // Only depend on the length, not the entire array

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

  const handleProductDiscontinued = () => {
    refetch();
    setDiscontinuingProduct(null);
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
        onDeleteProduct={(productId) => {
          const product = Object.values(groupedProducts).flat().find(p => p.productId === productId);
          if (product) {
            setDiscontinuingProduct(product);
          }
        }}
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

      <DiscontinueProductDialog
        isOpen={!!discontinuingProduct}
        onClose={() => setDiscontinuingProduct(null)}
        productId={discontinuingProduct?.productId || null}
        productName={discontinuingProduct?.name}
        onProductDiscontinued={handleProductDiscontinued}
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
