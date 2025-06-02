
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Edit } from 'lucide-react';

const LocationsList = () => {
  // Mock locations data
  const locations = [
    {
      id: '1',
      name: 'Main Office',
      address: '123 Garden Street, San Francisco, CA 94102',
      phone: '(555) 123-4567',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Warehouse',
      address: '456 Industrial Blvd, San Francisco, CA 94103',
      phone: '(555) 123-4568',
      isPrimary: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
        <Button className="bg-greenyp-600 hover:bg-greenyp-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="grid gap-6">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-greenyp-600" />
                  {location.name}
                  {location.isPrimary && (
                    <span className="ml-2 px-2 py-1 bg-greenyp-100 text-greenyp-700 text-xs rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-600">{location.address}</p>
                <p className="text-gray-600">{location.phone}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LocationsList;
