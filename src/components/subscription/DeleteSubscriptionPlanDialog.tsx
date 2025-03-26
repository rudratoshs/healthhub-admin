
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
} from '@/components/ui/alert-dialog';
import { Loader } from '@/components/ui/loader';

interface DeleteSubscriptionPlanDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  planName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteSubscriptionPlanDialog: React.FC<DeleteSubscriptionPlanDialogProps> = ({
  isOpen,
  isLoading,
  planName,
  onConfirm,
  onCancel,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subscription Plan</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the <span className="font-medium">{planName}</span> subscription plan? 
            This action cannot be undone and may affect users currently subscribed to this plan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader size="sm" className="mr-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSubscriptionPlanDialog;
