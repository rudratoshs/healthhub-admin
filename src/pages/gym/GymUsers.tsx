
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getGym, getGymUsers, removeUserFromGym } from "@/lib/gyms";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "@/components/ui/loader";
import { ArrowLeft, Plus, Trash, UserPlus } from "lucide-react";
import AddUserToGymDialog from "@/components/gym/AddUserToGymDialog";
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

const GymUsers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const gymId = parseInt(id as string);

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [userIdToRemove, setUserIdToRemove] = useState<number | null>(null);

  const { data: gym, isLoading: isGymLoading } = useQuery({
    queryKey: ["gym", gymId],
    queryFn: () => getGym(gymId),
    enabled: !isNaN(gymId),
  });

  const {
    data: usersData,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["gymUsers", gymId],
    queryFn: () => getGymUsers(gymId),
    enabled: !isNaN(gymId),
  });

  const removeUserMutation = useMutation({
    mutationFn: (userId: number) => removeUserFromGym(gymId, userId),
    onSuccess: () => {
      toast({
        title: "User removed",
        description: "User has been removed from the gym",
      });
      refetchUsers();
      setUserIdToRemove(null);
    },
    onError: (error) => {
      console.error("Failed to remove user:", error);
      toast({
        title: "Error",
        description: "Failed to remove user from gym",
        variant: "destructive",
      });
    },
  });

  const handleRemoveUser = () => {
    if (userIdToRemove !== null) {
      removeUserMutation.mutate(userIdToRemove);
    }
  };

  const handleUserAdded = () => {
    refetchUsers();
    setIsAddUserDialogOpen(false);
  };

  if (isGymLoading || isUsersLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border bg-card p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">Gym not found</h3>
          <p className="mb-4 text-muted-foreground">
            The gym you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate("/gyms")}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Gyms
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(`/gyms/${gym.id}`)}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Gym Details
        </Button>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <UserPlus size={16} className="mr-2" />
          Add User to Gym
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{gym.name} - Users</CardTitle>
          <CardDescription>Manage users associated with this gym</CardDescription>
        </CardHeader>
        <CardContent>
          {usersData?.data.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border p-8 text-center">
              <h3 className="mb-2 text-xl font-semibold">No users found</h3>
              <p className="mb-4 text-muted-foreground">
                This gym doesn't have any users yet.
              </p>
              <Button onClick={() => setIsAddUserDialogOpen(true)}>
                <Plus size={16} className="mr-2" />
                Add User
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData?.data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || "N/A"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.roles?.join(", ") || user.role || "N/A"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : user.status === "inactive"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserIdToRemove(user.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddUserToGymDialog
        gymId={gymId}
        isOpen={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
        onUserAdded={handleUserAdded}
      />

      <AlertDialog
        open={userIdToRemove !== null}
        onOpenChange={() => setUserIdToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User from Gym</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this user from the gym? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRemoveUser();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeUserMutation.isPending ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GymUsers;
