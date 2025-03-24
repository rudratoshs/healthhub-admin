
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAIConfigurations } from "@/lib/aiConfigurations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, AlertCircle } from "lucide-react";

interface AIClientSettingsProps {
  gymId: number;
}

const AIClientSettings: React.FC<AIClientSettingsProps> = ({ gymId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["aiConfigurations", gymId],
    queryFn: () => getAIConfigurations(gymId),
  });
  
  // Find the default configuration
  const defaultConfig = data?.data.find(config => config.is_default && config.status === "active");
  
  if (isLoading) {
    return <div className="flex justify-center p-4">Loading AI settings...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-lg text-destructive text-sm">
        <AlertCircle className="h-4 w-4 inline mr-2" />
        Error loading AI settings: {(error as Error).message}
      </div>
    );
  }
  
  if (!data?.data || data.data.length === 0 || !defaultConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            AI Settings
          </CardTitle>
          <CardDescription>
            No active AI configuration found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg text-sm">
            <p>Your gym administrator has not configured AI settings yet.</p>
            <p className="mt-2">This may limit some features that require AI processing.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              AI Settings
            </CardTitle>
            <CardDescription>
              Current AI configuration for assessments and plan generation
            </CardDescription>
          </div>
          <Badge className="bg-green-500">Active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Configuration</h3>
              <p className="text-sm text-muted-foreground">{defaultConfig.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">AI Provider</h3>
              <p className="text-sm text-muted-foreground capitalize">{defaultConfig.provider}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Model</h3>
              <p className="text-sm text-muted-foreground">{defaultConfig.model}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Last Updated</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(defaultConfig.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p>
              This AI configuration is used for generating diet suggestions, workout plans, 
              and analyzing assessment results.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIClientSettings;
