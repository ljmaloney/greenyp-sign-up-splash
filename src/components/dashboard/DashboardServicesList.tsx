
import React, { useState } from 'react';
import EditServiceDialog from './EditServiceDialog';
import AddServiceDialog from './AddServiceDialog';
import DeleteServiceDialog from './DeleteServiceDialog';
import ServicesHeader from './ServicesHeader';
import ServicesContent from './ServicesContent';
import { useServicesWithLocationCache } from '@/hooks/useServicesWithLocationCache';
import { ServiceResponse } from '@/services/servicesService';

const DashboardServicesList = () => {
  const [editingService, setEditingService] = useState<ServiceResponse | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [preSelectedLocationId, setPreSelectedLocationId] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const {
    locations,
    groupedServices,
    isLoading,
    error,
    refetch
  } = useServicesWithLocationCache();

  const handleEdit = (service: ServiceResponse) => {
    setEditingService(service);
  };

  const handleDelete = async () => {
    if (!deletingServiceId) return;
    
    setIsDeleting(true);
    try {
      // Delete service logic here
      console.log('Deleting service:', deletingServiceId);
      await refetch();
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setIsDeleting(false);
      setDeletingServiceId(null);
    }
  };

  const handleServiceUpdated = () => {
    refetch();
    setEditingService(null);
  };

  const handleServiceCreated = () => {
    refetch();
  };

  const handleAddService = (locationId: string) => {
    setPreSelectedLocationId(locationId);
    setIsAddingService(true);
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
        <ServicesHeader />
        <div className="text-center py-8">
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ServicesHeader />
        <div className="text-center py-8">
          <p className="text-red-600">Error loading services. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ServicesHeader />

      <ServicesContent
        groupedServices={groupedServices}
        locations={locations}
        openGroups={openGroups}
        onToggleGroup={toggleGroup}
        onEditService={handleEdit}
        onDeleteService={(serviceId) => setDeletingServiceId(serviceId)}
        onAddService={handleAddService}
      />

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

      <DeleteServiceDialog
        isOpen={!!deletingServiceId}
        isDeleting={isDeleting}
        onClose={() => setDeletingServiceId(null)}
        onConfirm={handleDelete}
        serviceId={deletingServiceId}
      />
    </div>
  );
};

export default DashboardServicesList;
