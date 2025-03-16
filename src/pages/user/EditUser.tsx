
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserById, updateUser } from "@/lib/users";
import { UpdateUserRequest } from "@/types/user";
import UserForm from "@/components/user/UserForm";

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const userId = Number(id);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId && !isNaN(userId)
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUser(userId, data),
    onSuccess: () => {
      navigate("/users");
    }
  });

  const handleSubmit = async (data: UpdateUserRequest) => {
    await mutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">User not found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The user you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <UserForm 
        user={user}
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
};

export default EditUser;
