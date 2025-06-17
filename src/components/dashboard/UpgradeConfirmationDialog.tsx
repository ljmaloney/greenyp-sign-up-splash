
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UpgradeConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subscriptionName: string;
  isLoading?: boolean;
}

const UpgradeConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  subscriptionName,
  isLoading = false
}: UpgradeConfirmationDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Subscription Upgrade</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to upgrade to the <strong>{subscriptionName}</strong> plan? 
            This will change your current subscription and billing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            Cancel Upgrade
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isLoading}
            className="bg-greenyp-600 hover:bg-greenyp-700"
          >
            {isLoading ? 'Upgrading...' : 'Confirm Upgrade'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpgradeConfirmationDialog;
