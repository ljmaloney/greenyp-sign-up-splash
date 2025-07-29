
import React from 'react';
import { Button } from "@/components/ui/button.tsx";

interface EditPrimaryLocationDialogFooterProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const EditPrimaryLocationDialogFooter = ({ isSubmitting, onCancel }: EditPrimaryLocationDialogFooterProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-greenyp-600 hover:bg-greenyp-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default EditPrimaryLocationDialogFooter;
