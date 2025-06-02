
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Plus, Edit } from 'lucide-react';

const DashboardServicesList = () => {
  // Mock services data
  const services = [
    {
      id: '1',
      name: 'Lawn Maintenance',
      minPrice: 50,
      maxPrice: 100,
      priceUnit: 'per visit',
      description: 'Complete lawn care including mowing, edging, and cleanup'
    },
    {
      id: '2',
      name: 'Garden Design',
      minPrice: 500,
      maxPrice: 2000,
      priceUnit: 'per project',
      description: 'Professional garden design and installation services'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <Button className="bg-greenyp-600 hover:bg-greenyp-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wrench className="w-5 h-5 mr-2 text-greenyp-600" />
                  {service.name}
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
                  <p className="text-gray-600">{service.description}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-greenyp-600">
                    ${service.minPrice} - ${service.maxPrice}
                  </p>
                  <p className="text-sm text-gray-500">{service.priceUnit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardServicesList;
