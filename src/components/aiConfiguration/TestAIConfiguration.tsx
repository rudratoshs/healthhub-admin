import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAIConfiguration,
  testAIConfiguration,
} from "@/lib/aiConfigurations";
import { TestAIConfigurationRequest } from "@/types/aiConfiguration";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ChevronLeft, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface TestAIConfigurationProps {
  gymId: number;
  configId: number;
}

const TestAIConfiguration: React.FC<TestAIConfigurationProps> = ({
  gymId,
  configId,
}) => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [usage, setUsage] = useState<{
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null>(null);

  const { data: configData, isLoading: isConfigLoading } = useQuery({
    queryKey: ["aiConfiguration", gymId, configId],
    queryFn: () => getAIConfiguration(gymId, configId),
  });

  const testMutation = useMutation({
    mutationFn: (data: TestAIConfigurationRequest) =>
      testAIConfiguration(gymId, configId, data),
    onSuccess: (response) => {
      setResult(response.data.result);
      setUsage(response.data.usage || null);
      setIsSheetOpen(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to test AI configuration",
        variant: "destructive",
      });
    },
  });

  const handleTest = () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to test",
        variant: "destructive",
      });
      return;
    }

    testMutation.mutate({ prompt });
  };

  if (isConfigLoading) {
    return (
      <div className="flex justify-center p-8">
        Loading AI configuration details...
      </div>
    );
  }

  const config = configData?.data;

  if (!config) {
    return (
      <div className="bg-destructive/10 p-4 rounded-lg text-destructive">
        <AlertCircle className="h-4 w-4 inline mr-2" />
        AI configuration not found
      </div>
    );
  }

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

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Test AI Configuration</CardTitle>
              <CardDescription>
                Send a test prompt to verify your configuration works correctly
              </CardDescription>
            </div>
            <Badge
              className={
                config.status === "active" ? "bg-green-500" : "bg-gray-500"
              }
            >
              {config.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Configuration Name</h3>
              <p className="text-sm text-muted-foreground">{config.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Provider / Model</h3>
              <p className="text-sm text-muted-foreground">
                {config.provider} / {config.model}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Test Prompt
            </label>
            <Textarea
              placeholder="Enter a prompt to test this AI configuration..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Example: "Create a sample breakfast recipe for weight loss" or
              "Suggest a 30-minute workout routine"
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            onClick={handleTest}
            disabled={testMutation.isPending || !prompt.trim()}
          >
            {testMutation.isPending ? (
              "Testing..."
            ) : (
              <>
                <Zap className="h-4 w-4 mr-1" />
                Run Test
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>AI Response</SheetTitle>
            <SheetDescription>
              Response from {config.provider} using {config.model}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
              {result}
            </div>

            {usage && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-1">Usage Statistics</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Prompt Tokens</p>
                    <p className="font-medium">{usage.prompt_tokens}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Completion Tokens</p>
                    <p className="font-medium">{usage.completion_tokens}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Tokens</p>
                    <p className="font-medium">{usage.total_tokens}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TestAIConfiguration;
