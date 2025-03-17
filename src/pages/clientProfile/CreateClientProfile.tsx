
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createClientProfile } from "@/lib/clientProfiles";
import ClientProfileForm from "@/components/clientProfile/ClientProfileForm";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateClientProfileRequest } from "@/types/clientProfile";

const CreateClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const userId = id ? parseInt(id) : 0;

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateClientProfileRequest) => createClientProfile(userId, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Client profile created successfully",
      });
      navigate(`/users/${userId}/profile`);
    },
    onError: (error) => {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: "Failed to create client profile",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: CreateClientProfileRequest) => {
    mutate(data);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(`/users/${userId}`)}>
          <ArrowLeft size={16} className="mr-2" />
          Back to User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Client Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientProfileForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            userId={userId}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateClientProfile;
