
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getGym, updateGym } from "@/lib/gyms";
import GymForm, { GymFormValues } from "@/components/gym/GymForm";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

const EditGym: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const gymId = parseInt(id as string);

  const { data: gym, isLoading } = useQuery({
    queryKey: ["gym", gymId],
    queryFn: () => getGym(gymId),
    enabled: !isNaN(gymId),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: GymFormValues) => updateGym(gymId, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Gym updated successfully",
      });
      navigate("/gyms");
    },
    onError: (error) => {
      console.error("Error updating gym:", error);
      toast({
        title: "Error",
        description: "Failed to update gym",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: GymFormValues) => {
    mutate(data);
  };

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
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/gyms")}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Gyms
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Gym</CardTitle>
        </CardHeader>
        <CardContent>
          <GymForm
            defaultValues={{
              name: gym.name,
              address: gym.address,
              phone: gym.phone,
            }}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitButtonText="Update Gym"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditGym;
