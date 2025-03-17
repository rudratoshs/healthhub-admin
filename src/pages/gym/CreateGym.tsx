
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createGym } from "@/lib/gyms";
import GymForm, { GymFormValues } from "@/components/gym/GymForm";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreateGym: React.FC = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: GymFormValues) => createGym(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Gym created successfully",
      });
      navigate("/gyms");
    },
    onError: (error) => {
      console.error("Error creating gym:", error);
      toast({
        title: "Error",
        description: "Failed to create gym",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: GymFormValues) => {
    mutate(data);
  };

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
          <CardTitle>Create New Gym</CardTitle>
        </CardHeader>
        <CardContent>
          <GymForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitButtonText="Create Gym"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGym;
