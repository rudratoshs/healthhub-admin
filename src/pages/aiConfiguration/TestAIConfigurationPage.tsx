import React from "react";
import { useParams } from "react-router-dom";
import TestAIConfiguration from "@/components/aiConfiguration/TestAIConfiguration";

const TestAIConfigurationPage: React.FC = () => {
  const { gymId, configId } = useParams<{ gymId: string; configId: string }>();
  const numericGymId = gymId ? parseInt(gymId) : 1;
  const numericConfigId = configId ? parseInt(configId) : 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Test AI Configuration
        </h1>
        <p className="text-muted-foreground">
          Verify your AI configuration is working correctly
        </p>
      </div>

      <TestAIConfiguration gymId={numericGymId} configId={numericConfigId} />
    </div>
  );
};

export default TestAIConfigurationPage;
