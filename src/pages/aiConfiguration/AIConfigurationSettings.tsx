import React from "react";
import { useParams } from "react-router-dom";
import AIConfigurationList from "@/components/aiConfiguration/AIConfigurationList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AIConfigurationSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const gymId = id ? parseInt(id) : 1; // Default to gym ID 1 if none provided

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          AI Configuration Settings
        </h1>
        <p className="text-muted-foreground">
          Manage and configure AI models for your gym's assessments and diet
          plans
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What are AI Configurations?</CardTitle>
          <CardDescription>
            AI configurations allow you to connect to different AI providers and
            customize how AI is used in your gym for generating meal plans,
            assessment analyses, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Why configure AI settings?</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>
                Use your own API keys for better control and cost management
              </li>
              <li>
                Choose between different AI providers (OpenAI, Anthropic,
                Google, etc.)
              </li>
              <li>Customize AI parameters like temperature and token limits</li>
              <li>Create multiple configurations for different use cases</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <AIConfigurationList gymId={gymId} />
    </div>
  );
};

export default AIConfigurationSettings;
