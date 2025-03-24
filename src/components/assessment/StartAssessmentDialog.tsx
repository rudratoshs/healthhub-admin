// Only updating the required part for the assessment_type
import React, { useState } from 'react';
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
} from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useMutation } from '@tanstack/react-query';
import { startAssessment } from '@/lib/assessments';
import { useAuth } from '@/contexts/AuthContext';

interface StartAssessmentDialogProps {
  onAssessmentStart: () => void;
}

const StartAssessmentDialog: React.FC<StartAssessmentDialogProps> = ({ onAssessmentStart }) => {
  const [open, setOpen] = useState(false);
  const [assessmentType, setAssessmentType] = useState<string | null>(null);
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: () => startAssessment(user?.id as number, { assessment_type: assessmentType as "diet" | "fitness" | "health" }),
    onSuccess: () => {
      setOpen(false);
      onAssessmentStart();
    },
  });

  // Replace the data in the mutation with a required assessment_type
  const handleStartAssessment = async () => {
    mutation.mutate({
      assessment_type: assessmentType as "diet" | "fitness" | "health",
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Start Assessment</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Start New Assessment</AlertDialogTitle>
          <AlertDialogDescription>
            Choose the type of assessment you want to start.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <RadioGroup defaultValue={assessmentType || undefined} onValueChange={setAssessmentType} className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="diet" id="diet" />
            <Label htmlFor="diet">Diet Assessment</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fitness" id="fitness" />
            <Label htmlFor="fitness">Fitness Assessment</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="health" id="health" />
            <Label htmlFor="health">Health Assessment</Label>
          </div>
        </RadioGroup>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={!assessmentType || mutation.isLoading} onClick={handleStartAssessment}>
            {mutation.isLoading ? 'Starting...' : 'Start Assessment'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StartAssessmentDialog;
