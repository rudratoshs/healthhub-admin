
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getClientProfile } from "@/lib/clientProfiles";
import ClientProfileDetail from "@/components/clientProfile/ClientProfileDetail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, User } from "lucide-react";
import { Loader } from "@/components/ui/loader";

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const userId = id ? parseInt(id) : 0;

  const { data, isLoading, error } = useQuery({
    queryKey: ["clientProfile", userId],
    queryFn: () => getClientProfile(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <Loader size="lg" variant="primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700">Error Loading Profile</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p>There was an error loading the client profile. The profile may not exist.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate(`/users/${userId}`)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to User
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 font-poppins">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-poppins text-primary-900">Client Profile</h1>
          <p className="text-muted-foreground">View and manage client health and nutrition details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/users/${userId}`)}>
            <ArrowLeft size={16} className="mr-2" />
            Back to User
          </Button>
          <Button onClick={() => navigate(`/users/${userId}/profile/edit`)} className="bg-primary hover:bg-primary-600">
            <Edit size={16} className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
            <User size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-900">User ID: {userId}</h2>
            <p className="text-sm text-muted-foreground">Profile last updated: {new Date(data.data.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <ClientProfileDetail profile={data.data} />
    </div>
  );
};

export default ClientProfile;
