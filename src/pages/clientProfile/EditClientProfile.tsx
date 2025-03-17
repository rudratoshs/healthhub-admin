
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getClientProfile, updateClientProfile } from "@/lib/clientProfiles";
import ClientProfileForm from "@/components/clientProfile/ClientProfileForm";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { UpdateClientProfileRequest } from "@/types/clientProfile";

const EditClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const userId = id ? parseInt(id) : 0;

  const { data, isLoading } = useQuery({
    queryKey: ["clientProfile", userId],
    queryFn: () => getClientProfile(userId),
    enabled: !!userId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateClientProfileRequest) => updateClientProfile(userId, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Client profile updated successfully",
      });
      navigate(`/users/${userId}/profile`);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update client profile",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: UpdateClientProfileRequest) => {
    mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <Loader size="lg" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate(`/users/${userId}/profile`)}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Profile
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Client Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {data ? (
            <ClientProfileForm
              initialValues={data.data}
              onSubmit={handleSubmit}
              isSubmitting={isPending}
              userId={userId}
            />
          ) : (
            <div className="text-center p-6">
              <p className="text-muted-foreground">Profile data not available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditClientProfile;
