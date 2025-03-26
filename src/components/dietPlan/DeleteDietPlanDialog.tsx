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
import { Trash2 } from 'lucide-react';

interface DeleteDietPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  isDeleting: boolean;
  hasMealPlans?: boolean;
}

const DeleteDietPlanDialog: React.FC<DeleteDietPlanDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Untitled Diet Plan',
  isDeleting,
  hasMealPlans = false,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="animate-fade-in">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center">
            <Trash2 className="h-5 w-5 mr-2" /> Delete Diet Plan
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete the diet plan: <span className="font-semibold">{title}</span>?
            </p>
            <p className="text-destructive">
              This action cannot be undone. This will permanently delete the diet plan 
              {hasMealPlans ? ' and all associated meal plans.' : '.'}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Diet Plan'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDietPlanDialog;