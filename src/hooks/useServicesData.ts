
import { useState, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { deleteService } from '@/services/serviceService';
import { apiClient } from '@/utils/apiClient';


export const useServicesData = () => {
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

  // Mock services data with location associations and priceUnitsType
  const services = [
    {
      id: '1',
      producerServiceId: '1',
      name: 'Lawn Maintenance',
      shortDescription: 'Lawn Maintenance',
      minPrice: 50,
      maxPrice: 100,
      minServicePrice: 50,
      maxServicePrice: 100,
      priceUnitsType: 'PER_VISIT',
      priceUnit: 'per visit',
      description: 'Complete lawn care including mowing, edging, and cleanup',
      serviceTerms: 'Weather permitting',
      locationId: '1'
    },
    {
      id: '2',
      producerServiceId: '2',
      name: 'Garden Design',
      shortDescription: 'Garden Design',
      minPrice: 500,
      maxPrice: 2000,
      minServicePrice: 500,
      maxServicePrice: 2000,
      priceUnitsType: 'FIXED_ESTIMATE',
      priceUnit: 'per project',
      description: 'Professional garden design and installation services',
      serviceTerms: 'Design approval required before installation',
      locationId: '2'
    },
    {
      id: '3',
      producerServiceId: '3',
      name: 'Tree Trimming',
      shortDescription: 'Tree Trimming',
      minPrice: 150,
      maxPrice: 500,
      minServicePrice: 150,
      maxServicePrice: 500,
      priceUnitsType: 'PER_VISIT',
      priceUnit: 'per visit',
      description: 'Professional tree trimming and maintenance',
      serviceTerms: 'Safety equipment required',
      locationId: '1'
    }
  ];

  // Group services by location
  const groupedServices = useMemo(() => {
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
      await deleteService(apiClient, serviceId);
      
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

  return {
    // State
    editingService,
    isAddingService,
    deletingServiceId,
    isDeleting,
    preSelectedLocationId,
    openGroups,
    
    // Data
    locations,
    services,
    groupedServices,
    
    // Actions
    setEditingService,
    setIsAddingService,
    setDeletingServiceId,
    setPreSelectedLocationId,
    handleEdit,
    handleDelete,
    handleServiceUpdated,
    handleServiceCreated,
    handleAddService,
    toggleGroup
  };
};
