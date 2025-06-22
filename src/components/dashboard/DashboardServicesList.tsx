
import React, { useState, useEffect, useMemo } from 'react';
import EditServiceDialog from './EditServiceDialog';
import AddServiceDialog from './AddServiceDialog';
import DiscontinueServiceDialog from './DiscontinueServiceDialog';
import ServicesHeader from './ServicesHeader';
import ServicesContent from './ServicesContent';
import { useServicesWithLocationCache } from '@/hooks/useServicesWithLocationCache';
import { ServiceResponse } from '@/services/servicesService';

const DashboardServicesList = () => {
  const [editingService, setEditingService] = useState<ServiceResponse | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [discontinuingService, setDiscontinuingService] = useState<ServiceResponse | null>(null);
  const [preSelectedLocationId, setPreSelectedLocationId] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const {
    locations,
    groupedServices,
    isLoading,
    error,
    refetch
  } = useServicesWithLocationCache();

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

  const handleEdit = (service: ServiceResponse) => {
    setEditingService(service);
  };

  const handleServiceUpdated = () => {
    refetch();
    setEditingService(null);
  };

  const handleServiceDiscontinued = () => {
    refetch();
    setDiscontinuingService(null);
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
        onDeleteService={(serviceId) => {
          const service = Object.values(groupedServices).flat().find(s => s.producerServiceId === serviceId);
          if (service) {
            setDiscontinuingService(service);
          }
        }}
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

      <DiscontinueServiceDialog
        isOpen={!!discontinuingService}
        onClose={() => setDiscontinuingService(null)}
        serviceId={discontinuingService?.producerServiceId || null}
        serviceName={discontinuingService?.shortDescription}
        onServiceDiscontinued={handleServiceDiscontinued}
      />
    </div>
  );
};

export default DashboardServicesList;
