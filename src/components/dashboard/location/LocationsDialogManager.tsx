
import React from 'react';
import { Location } from '@/services/locationService.ts';
import { LocationFormData } from '@/types/location.ts';
import AddLocationDialog from './AddLocationDialog.tsx';
import EditLocationDialog from './EditLocationDialog.tsx';

interface LocationsDialogManagerProps {
  isAddDialogOpen: boolean;
  editingLocation: Location | null;
  onCloseAddDialog: () => void;
  onCloseEditDialog: () => void;
  onLocationAdded: (newLocation: Location) => void;
  onLocationUpdated: (updatedLocation: LocationFormData) => void;
}

const LocationsDialogManager = ({
  isAddDialogOpen,
  editingLocation,
  onCloseAddDialog,
  onCloseEditDialog,
  onLocationAdded,
  onLocationUpdated
}: LocationsDialogManagerProps) => {
  return (
    <>
      <AddLocationDialog
        isOpen={isAddDialogOpen}
        onClose={onCloseAddDialog}
        onLocationAdded={onLocationAdded}
      />

      {editingLocation && (
        <EditLocationDialog
          isOpen={true}
          onClose={onCloseEditDialog}
          location={editingLocation}
          onLocationUpdated={onLocationUpdated}
        />
      )}
    </>
  );
};

export default LocationsDialogManager;
