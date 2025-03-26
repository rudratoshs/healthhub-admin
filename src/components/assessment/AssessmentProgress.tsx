import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface AssessmentProgressProps {
  currentPhase: number;
  totalPhases: number;
  phaseTitle: string;
}

const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentPhase,
  totalPhases,
  phaseTitle,
}) => {
  const progressPercentage = ((currentPhase) / totalPhases) * 100;

  return (
    <div className="mb-6 space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Phase {currentPhase} of {totalPhases}
          </h3>
          <h2 className="text-xl font-semibold">{phaseTitle}</h2>
        </div>
        <div className="text-sm font-medium">
          {Math.round(progressPercentage)}%
        </div>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      <Separator />
    </div>
  );
};

export default AssessmentProgress;