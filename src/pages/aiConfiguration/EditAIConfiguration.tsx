
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAIConfiguration, updateAIConfiguration } from "@/lib/aiConfigurations";
import { UpdateAIConfigurationRequest } from "@/types/aiConfiguration";
import AIConfigurationForm from "@/components/aiConfiguration/AIConfigurationForm";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const EditAIConfiguration: React.FC = () => {
  const { gymId, configId } = useParams<{ gymId: string; configId: string }>();
  const numericGymId = gymId ? parseInt(gymId) : 1;
  const numericConfigId = configId ? parseInt(configId) : 1;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["aiConfiguration", numericGymId, numericConfigId],
    queryFn: () => getAIConfiguration(numericGymId, numericConfigId),
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: UpdateAIConfigurationRequest) => 
      updateAIConfiguration(numericGymId, numericConfigId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiConfiguration", numericGymId, numericConfigId] });
      queryClient.invalidateQueries({ queryKey: ["aiConfigurations", numericGymId] });
      toast({
        title: "Success",
        description: "AI configuration updated successfully",
      });
      navigate(`/gyms/${numericGymId}/ai-configurations`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update AI configuration",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: UpdateAIConfigurationRequest) => {
    // If API key is empty, remove it from the request
    if (data.api_key === "") {
      delete data.api_key;
    }
    updateMutation.mutate(data);
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading AI configuration...</div>;
  }
  
  if (error || !data?.data) {
    return (
      <div className="bg-destructive/10 p-4 rounded-lg text-destructive">
        Error loading AI configuration: {(error as Error)?.message || "Configuration not found"}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/gyms/${numericGymId}/ai-configurations`)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Configurations
        </Button>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit AI Configuration</h1>
        <p className="text-muted-foreground">
          Update {data.data.name} configuration details
        </p>
      </div>
      
      <AIConfigurationForm 
        gymId={numericGymId}
        initialData={data.data}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
};

export default EditAIConfiguration;
