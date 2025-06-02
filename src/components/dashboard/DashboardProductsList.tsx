
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Package, Plus, Edit, Trash, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { deleteProduct } from '@/services/productService';
import AddProductDialog from './AddProductDialog';
import EditProductDialog from './EditProductDialog';

const DashboardProductsList = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
    }
  ];

  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown Location';
  };

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
      
      // In a real app, you would refetch the products list here
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
    // In a real app, you would refetch the products list here
    console.log('Product updated, refreshing list...');
  };

  const handleProductCreated = () => {
    // In a real app, you would refetch the products list here
    console.log('Product created, refreshing list...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Button 
          className="bg-greenyp-600 hover:bg-greenyp-700"
          onClick={() => setIsAddingProduct(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-greenyp-600" />
                  <div>
                    <div>{product.name}</div>
                    <div className="flex items-center text-sm text-gray-500 font-normal">
                      <MapPin className="w-3 h-3 mr-1" />
                      {getLocationName(product.locationId)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingProductId(product.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-sm text-gray-500">Category: {product.category}</p>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-2xl font-bold text-greenyp-600">${product.price}</p>
                  <p className="text-sm text-gray-500">In Stock: {product.quantity}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddProductDialog
        isOpen={isAddingProduct}
        onClose={() => setIsAddingProduct(false)}
        onProductCreated={handleProductCreated}
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
