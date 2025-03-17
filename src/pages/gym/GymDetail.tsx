
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGym } from "@/lib/gyms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { ArrowLeft, Edit, Users } from "lucide-react";

const GymDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const gymId = parseInt(id as string);

  const { data: gym, isLoading } = useQuery({
    queryKey: ["gym", gymId],
    queryFn: () => getGym(gymId),
    enabled: !isNaN(gymId),
  });

  if (isLoading) {
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
        <Button variant="outline" onClick={() => navigate("/gyms")}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Gyms
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/gyms/${gym.id}/users`)}
          >
            <Users size={16} className="mr-2" />
            View Users
          </Button>
          <Button 
            onClick={() => navigate(`/gyms/${gym.id}/edit`)}
          >
            <Edit size={16} className="mr-2" />
            Edit Gym
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{gym.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Address</h3>
              <p>{gym.address}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Phone</h3>
              <p>{gym.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GymDetail;
