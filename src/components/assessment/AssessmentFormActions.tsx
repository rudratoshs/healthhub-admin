
import React from 'react';
import { Button } from '@/components/ui/button';
import { UseMutationResult } from '@tanstack/react-query';
import { Assessment, CompleteAssessmentRequest, UpdateAssessmentRequest } from '@/types/assessment';

interface AssessmentFormActionsProps {
  currentPhase: number;
  totalPhases: number;
  updateMutation: UseMutationResult<any, Error, UpdateAssessmentRequest, unknown>;
  completeMutation: UseMutationResult<any, Error, CompleteAssessmentRequest, unknown>;
  onPrevious: () => void;
  onSaveProgress: () => void;
}

const AssessmentFormActions: React.FC<AssessmentFormActionsProps> = ({
  currentPhase,
  totalPhases,
  updateMutation,
  completeMutation,
  onPrevious,
  onSaveProgress
}) => {
  return (
    <div className="flex justify-between pt-4">
      <div>
        {currentPhase > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
          >
            Previous
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={onSaveProgress}
          className="ml-2"
          disabled={updateMutation.isPending}
        >
          Save Progress
        </Button>
      </div>
      <Button 
        type="submit"
        disabled={updateMutation.isPending || completeMutation.isPending}
      >
        {currentPhase === totalPhases ? (
          completeMutation.isPending ? "Completing..." : "Complete Assessment"
        ) : (
          updateMutation.isPending ? "Saving..." : "Next"
        )}
      </Button>
    </div>
  );
};

export default AssessmentFormActions;
