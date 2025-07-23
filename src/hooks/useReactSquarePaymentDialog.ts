
import { useState } from 'react';

export const useReactSquarePaymentDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    console.log('🚪 Opening React Square payment dialog');
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    console.log('🚪 Closing React Square payment dialog');
    setIsDialogOpen(false);
  };

  return {
    isDialogOpen,
    openDialog,
    closeDialog
  };
};
