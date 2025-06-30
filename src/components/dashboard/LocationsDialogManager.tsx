
import React from 'react';
import { Location } from '@/services/locationService';
import AddLocationDialog from './AddLocationDialog';
import EditLocationDialog from './EditLocationDialog';

interface LocationsDialogManagerProps {
  isAddDialogOpen: boolean;
  editingLocation: Location | null;
  onCloseAddDialog: () => void;
  onCloseEditDialog: () => void;
  onLocationAdded: (newLocation: Location) => void;
  onLocationUpdated: (updatedLocation: Location) => void;
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
