
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAIConfigurations, deleteAIConfiguration } from "@/lib/aiConfigurations";
import { AIConfiguration } from "@/types/aiConfiguration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AIConfigurationListProps {
  gymId: number;
}

const AIConfigurationList: React.FC<AIConfigurationListProps> = ({ gymId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["aiConfigurations", gymId],
    queryFn: () => getAIConfigurations(gymId),
  });
  
  const deleteMutation = useMutation({
    mutationFn: ({ configId }: { configId: number }) => 
      deleteAIConfiguration(gymId, configId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiConfigurations", gymId] });
      toast({
        title: "Success",
        description: "AI configuration deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete AI configuration",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading AI configurations...</div>;
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-lg text-destructive">
        Error loading AI configurations: {(error as Error).message}
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">No AI configurations found</p>
        <Button onClick={() => navigate(`/gyms/${gymId}/ai-configurations/create`)}>
          Create Configuration
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">AI Configurations</h2>
        <Button onClick={() => navigate(`/gyms/${gymId}/ai-configurations/create`)}>
          Add New Configuration
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.data.map((config: AIConfiguration) => (
          <Card key={config.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="truncate">{config.name}</CardTitle>
                <Badge className={config.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                  {config.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <span className="font-medium">Provider:</span> {config.provider}
                {config.is_default && (
                  <Badge variant="outline" className="ml-2">Default</Badge>
                )}
              </CardDescription>
              <CardDescription>
                <span className="font-medium">Model:</span> {config.model}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-muted-foreground">
                <div className="grid grid-cols-2 gap-2">
                  {config.settings.temperature !== undefined && (
                    <div>
                      <span className="font-medium">Temperature:</span> {config.settings.temperature}
                    </div>
                  )}
                  {config.settings.max_tokens !== undefined && (
                    <div>
                      <span className="font-medium">Max Tokens:</span> {config.settings.max_tokens}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/gyms/${gymId}/ai-configurations/${config.id}/test`)}
              >
                <Zap className="h-4 w-4 mr-1" />
                Test
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/gyms/${gymId}/ai-configurations/${config.id}/edit`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete AI Configuration</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this AI configuration? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteMutation.mutate({ configId: config.id })}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIConfigurationList;
