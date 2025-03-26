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

interface DeleteMealPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dayInfo: string;
  isDeleting: boolean;
}

const DeleteMealPlanDialog: React.FC<DeleteMealPlanDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  dayInfo,
  isDeleting,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="animate-fade-in">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center">
            <Trash2 className="h-5 w-5 mr-2" /> Delete Meal Plan
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete the meal plan for <span className="font-semibold">{dayInfo}</span>?
            </p>
            <p className="text-destructive">
              This action cannot be undone. This will permanently delete the meal plan and all associated meals and foods.
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
            {isDeleting ? 'Deleting...' : 'Delete Meal Plan'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMealPlanDialog;