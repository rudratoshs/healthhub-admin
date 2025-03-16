
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CreateUserRequest } from "@/types/user";
import { createUser } from "@/lib/users";
import UserForm from "@/components/user/UserForm";

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      navigate("/users");
    }
  });

  const handleSubmit = async (data: CreateUserRequest) => {
    await mutation.mutateAsync(data);
  };

  return (
    <div className="container max-w-4xl py-6">
      <UserForm 
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
};

export default CreateUser;
