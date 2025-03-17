
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addUserToGym } from "@/lib/gyms";
import { getUsers } from "@/lib/users";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/user";
import { GymUserRequest } from "@/types/gym";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AddUserToGymDialogProps {
  gymId: number;
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserToGymDialog: React.FC<AddUserToGymDialogProps> = ({
  gymId,
  isOpen,
  onClose,
  onUserAdded,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("client");
  const [selectedStatus, setSelectedStatus] = useState<string>("active");

  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({ role: "all" }),
    enabled: isOpen,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: GymUserRequest) => addUserToGym(gymId, data),
    onSuccess: () => {
      toast({
        title: "User added",
        description: "User has been added to the gym successfully",
      });
      resetForm();
      onUserAdded();
    },
    onError: (error) => {
      console.error("Failed to add user to gym:", error);
      toast({
        title: "Error",
        description: "Failed to add user to the gym",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedUserId("");
    setSelectedRole("client");
    setSelectedStatus("active");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive",
      });
      return;
    }

    const data: GymUserRequest = {
      user_id: parseInt(selectedUserId),
      role: selectedRole,
      status: selectedStatus as "active" | "inactive",
    };

    mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User to Gym</DialogTitle>
          <DialogDescription>
            Select a user and assign them to this gym with a specific role and status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              disabled={isUsersLoading || isPending}
            >
              <SelectTrigger id="user">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {isUsersLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader size="sm" />
                  </div>
                ) : (
                  users?.data.map((user: User) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name || user.email}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              disabled={isPending}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gym_admin">Gym Admin</SelectItem>
                <SelectItem value="trainer">Trainer</SelectItem>
                <SelectItem value="dietitian">Dietitian</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              disabled={isPending}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Adding...
                </>
              ) : (
                "Add User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserToGymDialog;
