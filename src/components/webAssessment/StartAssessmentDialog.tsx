
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
import { startWebAssessment, deleteWebAssessment } from '@/lib/webAssessment';
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
  const [activeView, setActiveView] = useState<'select-type' | 'confirm-delete'>('select-type');
  const [error, setError] = useState<string | null>(null);
  const [existingSessionId, setExistingSessionId] = useState<number | null>(null);

  // Reset dialog state when it's closed
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setActiveView('select-type');
      setError(null);
      setExistingSessionId(null);
    }
  };

  // Mutation for starting a new assessment
  const startMutation = useMutation({
    mutationFn: () => startWebAssessment({
      assessment_type: assessmentType,
      abandon_existing: false
    }),
    onSuccess: () => {
      setOpen(false);
      onAssessmentStart();
    },
    onError: (error: any) => {
      // Check if this is an error about existing session
      const errorMessage = error?.response?.data?.message || "";
      const sessionId = error?.response?.data?.session_id;
      
      if (errorMessage === "You already have an active assessment session" && sessionId) {
        setExistingSessionId(sessionId);
        setError("You already have an active assessment. Would you like to resume it or start a new one?");
      } else {
        setError(errorMessage || "Failed to start assessment");
      }
    }
  });

  // Mutation for deleting an existing assessment
  const deleteMutation = useMutation({
    mutationFn: (sessionId: number) => deleteWebAssessment({ session_id: sessionId }),
    onSuccess: () => {
      // After successful deletion, start a new assessment
      startNewAfterDelete();
    },
    onError: (error: any) => {
      setError(error?.response?.data?.message || "Failed to delete existing assessment");
    }
  });

  // Start a new assessment after deleting the existing one
  const startNewAfterDelete = () => {
    startWebAssessment({
      assessment_type: assessmentType,
      abandon_existing: true
    }).then(() => {
      setOpen(false);
      onAssessmentStart();
    }).catch(error => {
      setError(error?.response?.data?.message || "Failed to start new assessment");
    });
  };

  const handleStartAssessment = async () => {
    setError(null);
    startMutation.mutate();
  };

  const handleDeleteAndStart = () => {
    const idToDelete = existingSessionId || sessionId;
    if (idToDelete) {
      deleteMutation.mutate(idToDelete);
    }
  };

  const handleResumeExisting = () => {
    setOpen(false);
    onAssessmentStart(); // This will navigate to the assessment questions
  };

  const handleStartNew = () => {
    setActiveView('confirm-delete');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Start Assessment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {activeView === 'select-type' && (
          <>
            <DialogHeader>
              <DialogTitle>Start New Assessment</DialogTitle>
              <DialogDescription>
                Choose the type of assessment you want to start.
              </DialogDescription>
            </DialogHeader>
            
            {error && (error.includes("active assessment") || existingSessionId) ? (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Active Assessment Found</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={handleResumeExisting}>
                    Resume
                  </Button>
                  <Button variant="destructive" onClick={handleStartNew}>
                    Start New
                  </Button>
                </div>
              </Alert>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            {(!hasActiveAssessment || !error?.includes("active assessment")) && (
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
            )}

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              {(!hasActiveAssessment && !error?.includes("active assessment") && !existingSessionId) && (
                <Button 
                  onClick={handleStartAssessment} 
                  disabled={startMutation.isPending}
                >
                  {startMutation.isPending ? (
                    <>Starting <Loader className="ml-2 h-4 w-4" /></>
                  ) : 'Start Assessment'}
                </Button>
              )}
            </DialogFooter>
          </>
        )}

        {activeView === 'confirm-delete' && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your existing assessment and start a new one? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <RadioGroup 
              defaultValue={assessmentType} 
              onValueChange={(value) => setAssessmentType(value as "basic" | "moderate" | "comprehensive")}
              className="flex flex-col space-y-3 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id="delete-basic" />
                <Label htmlFor="delete-basic">Basic Assessment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="delete-moderate" />
                <Label htmlFor="delete-moderate">Moderate Assessment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comprehensive" id="delete-comprehensive" />
                <Label htmlFor="delete-comprehensive">Comprehensive Assessment</Label>
              </div>
            </RadioGroup>

            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Starting a new assessment will delete your current progress. This action cannot be undone.
              </AlertDescription>
            </Alert>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setActiveView('select-type')}>
                Back
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteAndStart} 
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>Deleting <Loader className="ml-2 h-4 w-4" /></>
                ) : 'Delete & Start New'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StartAssessmentDialog;
