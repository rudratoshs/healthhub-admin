
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteGym } from "@/lib/gyms";
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
import { toast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";

interface DeleteGymDialogProps {
  gymId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteComplete: () => void;
}

const DeleteGymDialog: React.FC<DeleteGymDialogProps> = ({
  gymId,
  isOpen,
  onClose,
  onDeleteComplete,
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (!gymId) throw new Error("Gym ID is required");
      return deleteGym(gymId);
    },
    onSuccess: () => {
      toast({
        title: "Gym deleted",
        description: "The gym has been successfully deleted.",
      });
      onClose();
      onDeleteComplete();
    },
    onError: (error) => {
      console.error("Failed to delete gym:", error);
      toast({
        title: "Failed to delete gym",
        description: "An error occurred while deleting the gym.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    mutate();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the gym
            and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader size="sm" className="mr-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteGymDialog;
