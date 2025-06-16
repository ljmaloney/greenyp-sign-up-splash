
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const EditPrimaryLocationDialogHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle>Edit Primary Location</DialogTitle>
      <DialogDescription>
        Update your primary location information. This is the main address for your business.
      </DialogDescription>
    </DialogHeader>
  );
};

export default EditPrimaryLocationDialogHeader;
