import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteProduct } from '@/services/productService';
import AddProductDialog from './AddProductDialog';
import EditProductDialog from './EditProductDialog';
import ProductLocationGroup from './ProductLocationGroup';

const DashboardProductsList = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [preSelectedLocationId, setPreSelectedLocationId] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Mock locations data
  const locations = [
    { id: '1', name: 'Main Office', address: '123 Garden Street, San Francisco, CA 94102' },
    { id: '2', name: 'Warehouse', address: '456 Industrial Blvd, San Francisco, CA 94103' }
  ];

  // Mock products data with location associations
  const products = [
    {
      id: '1',
      name: 'Organic Fertilizer - 25lb bag',
      price: 29.99,
      quantity: 150,
      category: 'Fertilizers',
      description: 'Premium organic fertilizer for lawn and garden use',
      locationId: '1'
    },
    {
      id: '2',
      name: 'Red Maple Tree - 6ft',
      price: 89.99,
      quantity: 25,
      category: 'Trees',
      description: 'Beautiful red maple tree, perfect for landscaping',
      locationId: '2'
    },
    {
      id: '3',
      name: 'Premium Potting Soil',
      price: 12.99,
      quantity: 200,
      category: 'Soil',
      description: 'Nutrient-rich potting soil blend',
      locationId: '1'
    }
  ];

  // Group products by location
  const groupedProducts = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    
    products.forEach(product => {
      const locationId = product.locationId || 'no-location';
      if (!groups[locationId]) {
        groups[locationId] = [];
      }
      groups[locationId].push(product);
    });
    
    return groups;
  }, [products]);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (productId) => {
    setIsDeleting(true);
    
    try {
      console.log('Deleting product:', productId);
      await deleteProduct(productId);
      
      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted.",
      });
      
      setDeletingProductId(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProductUpdated = () => {
    console.log('Product updated, refreshing list...');
  };

  const handleProductCreated = () => {
    console.log('Product created, refreshing list...');
  };

  const handleAddProduct = (locationId: string) => {
    setPreSelectedLocationId(locationId === 'no-location' ? '' : locationId);
    setIsAddingProduct(true);
  };

  const toggleGroup = (locationId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [locationId]: !prev[locationId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedProducts).map(([locationId, locationProducts]) => (
          <ProductLocationGroup
            key={locationId}
            locationId={locationId}
            locationProducts={locationProducts}
            locations={locations}
            isOpen={openGroups[locationId] || locationProducts.length === 1}
            onToggle={() => toggleGroup(locationId)}
            onEditProduct={handleEdit}
            onDeleteProduct={(productId) => setDeletingProductId(productId)}
            onAddProduct={handleAddProduct}
          />
        ))}
      </div>

      <AddProductDialog
        isOpen={isAddingProduct}
        onClose={() => {
          setIsAddingProduct(false);
          setPreSelectedLocationId('');
        }}
        onProductCreated={handleProductCreated}
        preSelectedLocationId={preSelectedLocationId}
      />

      <EditProductDialog
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        onProductUpdated={handleProductUpdated}
      />

      <AlertDialog open={!!deletingProductId} onOpenChange={() => setDeletingProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deletingProductId)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardProductsList;
