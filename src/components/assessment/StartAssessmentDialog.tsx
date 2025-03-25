
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
  const [assessmentType, setAssessmentType] = useState<"diet" | "fitness" | "health">("diet");
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: () => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }
      return startAssessment(user.id, { assessment_type: assessmentType });
    },
    onSuccess: () => {
      setOpen(false);
      onAssessmentStart();
    },
  });

  const handleStartAssessment = async () => {
    mutation.mutate();
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
        <RadioGroup defaultValue={assessmentType} onValueChange={(value) => setAssessmentType(value as "diet" | "fitness" | "health")} className="flex flex-col space-y-2">
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
          <AlertDialogAction disabled={mutation.isPending} onClick={handleStartAssessment}>
            {mutation.isPending ? 'Starting...' : 'Start Assessment'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StartAssessmentDialog;
