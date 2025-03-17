
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createClientProfile } from "@/lib/clientProfiles";
import ClientProfileForm from "@/components/clientProfile/ClientProfileForm";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Plus } from "lucide-react";
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
    <div className="container mx-auto p-6 font-poppins">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-playfair text-primary-900">Create Client Profile</h1>
          <p className="text-muted-foreground">Set up health and nutrition details</p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/users/${userId}`)}>
          <ArrowLeft size={16} className="mr-2" />
          Back to User
        </Button>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-green-50 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
            <User size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-900">User ID: {userId}</h2>
            <p className="text-sm text-muted-foreground">Creating new profile</p>
          </div>
        </div>
      </div>

      <Card className="shadow-md border-primary-100">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-green-50 pb-4">
          <CardTitle className="text-xl text-primary-900 font-playfair flex items-center">
            <Plus size={18} className="mr-2 text-green-600" />
            New Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
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
