
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Edit } from 'lucide-react';

const DashboardProductsList = () => {
  // Mock products data
  const products = [
    {
      id: '1',
      name: 'Organic Fertilizer - 25lb bag',
      price: 29.99,
      quantity: 150,
      category: 'Fertilizers',
      description: 'Premium organic fertilizer for lawn and garden use'
    },
    {
      id: '2',
      name: 'Red Maple Tree - 6ft',
      price: 89.99,
      quantity: 25,
      category: 'Trees',
      description: 'Beautiful red maple tree, perfect for landscaping'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Button className="bg-greenyp-600 hover:bg-greenyp-700">
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
                  {product.name}
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-sm text-gray-500">Category: {product.category}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-greenyp-600">${product.price}</p>
                  <p className="text-sm text-gray-500">In Stock: {product.quantity}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardProductsList;
