
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createAIConfiguration } from "@/lib/aiConfigurations";
import { CreateAIConfigurationRequest } from "@/types/aiConfiguration";
import AIConfigurationForm from "@/components/aiConfiguration/AIConfigurationForm";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const CreateAIConfiguration: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const gymId = id ? parseInt(id) : 1; // Default to gym ID 1 if none provided
  const navigate = useNavigate();
  
  const createMutation = useMutation({
    mutationFn: (data: CreateAIConfigurationRequest) => 
      createAIConfiguration(gymId, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "AI configuration created successfully",
      });
      navigate(`/gyms/${gymId}/ai-configurations`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create AI configuration",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: CreateAIConfigurationRequest) => {
    createMutation.mutate(data);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/gyms/${gymId}/ai-configurations`)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Configurations
        </Button>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create AI Configuration</h1>
        <p className="text-muted-foreground">
          Add a new AI provider configuration for your gym
        </p>
      </div>
      
      <AIConfigurationForm 
        gymId={gymId}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
};

export default CreateAIConfiguration;
