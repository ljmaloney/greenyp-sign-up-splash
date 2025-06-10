
import React from 'react';
import EditServiceDialog from './EditServiceDialog';
import AddServiceDialog from './AddServiceDialog';
import DeleteServiceDialog from './DeleteServiceDialog';
import ServicesHeader from './ServicesHeader';
import ServicesContent from './ServicesContent';
import { useServicesData } from '@/hooks/useServicesData';

const DashboardServicesList = () => {
  const {
    editingService,
    isAddingService,
    deletingServiceId,
    isDeleting,
    preSelectedLocationId,
    openGroups,
    locations,
    groupedServices,
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
  } = useServicesData();

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
