
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation } from '@tanstack/react-query';
import { startWebAssessment } from '@/lib/webAssessment';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { Loader } from '@/components/ui/loader';

interface StartAssessmentDialogProps {
  onAssessmentStart: () => void;
  hasActiveAssessment?: boolean;
  sessionId?: number | null;
}

const StartAssessmentDialog: React.FC<StartAssessmentDialogProps> = ({ 
  onAssessmentStart, 
  hasActiveAssessment = false,
  sessionId = null 
}) => {
  const [open, setOpen] = useState(false);
  const [assessmentType, setAssessmentType] = useState<"basic" | "moderate" | "comprehensive">("moderate");
  const [abandonExisting, setAbandonExisting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => startWebAssessment({
      assessment_type: assessmentType,
      abandon_existing: abandonExisting
    }),
    onSuccess: () => {
      setOpen(false);
      onAssessmentStart();
    },
    onError: (error: any) => {
      // If there's an existing assessment and the user hasn't chosen to abandon it
      if (error?.response?.data?.message === "You already have an active assessment session" && !abandonExisting) {
        setError("You already have an active assessment. Would you like to resume it or start a new one?");
      } else {
        setError(error?.response?.data?.message || "Failed to start assessment");
      }
    }
  });

  const handleStartAssessment = async () => {
    setError(null);
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Start Assessment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Assessment</DialogTitle>
          <DialogDescription>
            Choose the type of assessment you want to start.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {hasActiveAssessment && !abandonExisting && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Active Assessment Found</AlertTitle>
            <AlertDescription>
              You have an active assessment. Would you like to resume it or start a new one?
            </AlertDescription>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={() => {
                setOpen(false);
                onAssessmentStart();
              }}>
                Resume
              </Button>
              <Button variant="destructive" onClick={() => setAbandonExisting(true)}>
                Start New
              </Button>
            </div>
          </Alert>
        )}

        {(!hasActiveAssessment || abandonExisting) && (
          <>
            <RadioGroup 
              defaultValue={assessmentType} 
              onValueChange={(value) => setAssessmentType(value as "basic" | "moderate" | "comprehensive")}
              className="flex flex-col space-y-3 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id="basic" />
                <Label htmlFor="basic">Basic Assessment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate" />
                <Label htmlFor="moderate">Moderate Assessment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comprehensive" id="comprehensive" />
                <Label htmlFor="comprehensive">Comprehensive Assessment</Label>
              </div>
            </RadioGroup>

            {abandonExisting && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Starting a new assessment will abandon your current progress. This action cannot be undone.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {(!hasActiveAssessment || abandonExisting) && (
            <Button 
              onClick={handleStartAssessment} 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>Starting <Loader className="ml-2 h-4 w-4" /></>
              ) : 'Start Assessment'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartAssessmentDialog;
