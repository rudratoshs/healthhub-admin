
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface WebAssessmentProgressProps {
  progress: number;
  phase: number;
  totalPhases: number;
}

const WebAssessmentProgress: React.FC<WebAssessmentProgressProps> = ({ 
  progress, 
  phase, 
  totalPhases 
}) => {
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Phase {phase} of {totalPhases}</span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default WebAssessmentProgress;
