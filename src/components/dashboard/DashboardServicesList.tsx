
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { deleteService } from '@/services/serviceService';
import EditServiceDialog from './EditServiceDialog';
import AddServiceDialog from './AddServiceDialog';
import ServiceLocationGroup from './ServiceLocationGroup';

const DashboardServicesList = () => {
  const [editingService, setEditingService] = useState(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [preSelectedLocationId, setPreSelectedLocationId] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
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
    },
    {
      id: '3',
      name: 'Tree Trimming',
      minPrice: 150,
      maxPrice: 500,
      priceUnit: 'per visit',
      description: 'Professional tree trimming and maintenance',
      locationId: '1'
    }
  ];

  // Group services by location
  const groupedServices = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    
    services.forEach(service => {
      const locationId = service.locationId || 'no-location';
      if (!groups[locationId]) {
        groups[locationId] = [];
      }
      groups[locationId].push(service);
    });
    
    return groups;
  }, [services]);

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
    console.log('Service updated, refreshing list...');
  };

  const handleServiceCreated = () => {
    console.log('Service created, refreshing list...');
  };

  const handleAddService = (locationId: string) => {
    setPreSelectedLocationId(locationId === 'no-location' ? '' : locationId);
    setIsAddingService(true);
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
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <Button 
          className="bg-greenyp-600 hover:bg-greenyp-700"
          onClick={() => setIsAddingService(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedServices).map(([locationId, locationServices]) => (
          <ServiceLocationGroup
            key={locationId}
            locationId={locationId}
            locationServices={locationServices}
            locations={locations}
            isOpen={openGroups[locationId] || locationServices.length === 1}
            onToggle={() => toggleGroup(locationId)}
            onEditService={handleEdit}
            onDeleteService={(serviceId) => setDeletingServiceId(serviceId)}
            onAddService={handleAddService}
          />
        ))}
      </div>

      <AddServiceDialog
        isOpen={isAddingService}
        onClose={() => {
          setIsAddingService(false);
          setPreSelectedLocationId('');
        }}
        onServiceCreated={handleServiceCreated}
        preSelectedLocationId={preSelectedLocationId}
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
