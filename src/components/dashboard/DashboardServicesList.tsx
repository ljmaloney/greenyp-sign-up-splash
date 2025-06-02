import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Wrench, Plus, Edit, Trash, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { deleteService } from '@/services/serviceService';
import EditServiceDialog from './EditServiceDialog';
import AddServiceDialog from './AddServiceDialog';

const DashboardServicesList = () => {
  const [editingService, setEditingService] = useState(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Mock locations data
  const locations = [
    { id: '1', name: 'Main Office', address: '123 Garden Street, San Francisco, CA 94102' },
    { id: '2', name: 'Warehouse', address: '456 Industrial Blvd, San Francisco, CA 94103' }
  ];

  // Mock services data with location associations
  const services = [
    {
      id: '1',
      name: 'Lawn Maintenance',
      minPrice: 50,
      maxPrice: 100,
      priceUnit: 'per visit',
      description: 'Complete lawn care including mowing, edging, and cleanup',
      locationId: '1'
    },
    {
      id: '2',
      name: 'Garden Design',
      minPrice: 500,
      maxPrice: 2000,
      priceUnit: 'per project',
      description: 'Professional garden design and installation services',
      locationId: '2'
    }
  ];

  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown Location';
  };

  const handleEdit = (service) => {
    setEditingService(service);
  };

  const handleDelete = async (serviceId) => {
    setIsDeleting(true);
    
    try {
      console.log('Deleting service:', serviceId);
      await deleteService(serviceId);
      
      toast({
        title: "Service Deleted",
        description: "The service has been successfully deleted.",
      });
      
      // In a real app, you would refetch the services list here
      setDeletingServiceId(null);
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleServiceUpdated = () => {
    // In a real app, you would refetch the services list here
    console.log('Service updated, refreshing list...');
  };

  const handleServiceCreated = () => {
    // In a real app, you would refetch the services list here
    console.log('Service created, refreshing list...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <Button 
          className="bg-greenyp-600 hover:bg-greenyp-700"
          onClick={() => setIsAddingService(true)}
        >
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
                  <div>
                    <div>{service.name}</div>
                    <div className="flex items-center text-sm text-gray-500 font-normal">
                      <MapPin className="w-3 h-3 mr-1" />
                      {getLocationName(service.locationId)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingServiceId(service.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-gray-600">{service.description}</p>
                </div>
                <div className="text-right ml-4">
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

      <AddServiceDialog
        isOpen={isAddingService}
        onClose={() => setIsAddingService(false)}
        onServiceCreated={handleServiceCreated}
      />

      <EditServiceDialog
        isOpen={!!editingService}
        onClose={() => setEditingService(null)}
        service={editingService}
        onServiceUpdated={handleServiceUpdated}
      />

      <AlertDialog open={!!deletingServiceId} onOpenChange={() => setDeletingServiceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deletingServiceId)}
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

export default DashboardServicesList;
