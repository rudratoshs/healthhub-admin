
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getClientProfile, updateClientProfile } from "@/lib/clientProfiles";
import ClientProfileForm from "@/components/clientProfile/ClientProfileForm";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, User } from "lucide-react";
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
    <div className="container mx-auto p-6 font-poppins">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-playfair text-primary-900">Edit Client Profile</h1>
          <p className="text-muted-foreground">Update health and nutrition details</p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/users/${userId}/profile`)}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Profile
        </Button>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
            <User size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-900">User ID: {userId}</h2>
            {data && <p className="text-sm text-muted-foreground">Profile last updated: {new Date(data.data.updated_at).toLocaleDateString()}</p>}
          </div>
        </div>
      </div>

      <Card className="shadow-md border-primary-100">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 pb-4">
          <CardTitle className="text-xl text-primary-900 font-playfair">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
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
