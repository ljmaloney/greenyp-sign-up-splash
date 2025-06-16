
import React from 'react';
import { Button } from "@/components/ui/button";
import { Location } from "@/services/locationService";

interface EditLocationActionsProps {
  location: Location;
  onClose: () => void;
  onDisableLocation: () => void;
}

const EditLocationActions = ({ location, onClose, onDisableLocation }: EditLocationActionsProps) => {
  const canDisableLocation = location.active && location.locationType !== 'HOME_OFFICE_PRIMARY';

  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <div>
        {canDisableLocation && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onDisableLocation}
          >
            Disable Location
          </Button>
        )}
      </div>
      <div className="flex space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-greenyp-600 hover:bg-greenyp-700">
          Update Location
        </Button>
      </div>
    </div>
  );
};

export default EditLocationActions;
