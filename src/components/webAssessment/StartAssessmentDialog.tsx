import React, { useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { startWebAssessment, deleteWebAssessment } from "@/lib/webAssessment";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Loader } from "@/components/ui/loader";

interface StartAssessmentDialogProps {
  onAssessmentStart: (sessionId?: number) => void;
  hasActiveAssessment?: boolean;
  sessionId?: number | null;
}

const StartAssessmentDialog: React.FC<StartAssessmentDialogProps> = ({
  onAssessmentStart,
  hasActiveAssessment = false,
  sessionId = null,
}) => {
  const [open, setOpen] = useState(false);
  const [assessmentType, setAssessmentType] = useState<
    "basic" | "moderate" | "comprehensive"
  >("moderate");
  const [activeView, setActiveView] = useState<
    "select-type" | "confirm-delete"
  >("select-type");
  const [error, setError] = useState<string | null>(null);
  const [localSessionId, setLocalSessionId] = useState<number | null>(
    sessionId
  );

  // Reset dialog state when it's closed
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setActiveView("select-type");
      setError(null);
    }
  };

  // Mutation for starting a new assessment
  const startMutation = useMutation({
    mutationFn: () =>
      startWebAssessment({
        assessment_type: assessmentType,
        abandon_existing: false,
      }),
    onSuccess: () => {
      setOpen(false);
      onAssessmentStart();
    },
    onError: (error: any) => {
      const message = error?.message?.toLowerCase() || "";
      const sessionIdFromError = error?.session_id;

      if (message.includes("active assessment")) {
        setError("active assessment");
        if (sessionIdFromError) {
          setLocalSessionId(sessionIdFromError);
        }
      } else {
        setError(
          error?.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    },
  });

  // Mutation for deleting an existing assessment
  const deleteMutation = useMutation({
    mutationFn: (sessionId: number) =>
      deleteWebAssessment({ session_id: sessionId }),
    onSuccess: () => {
      // After successful deletion, start a new assessment
      startNewAfterDelete();
    },
    onError: (error: any) => {
      setError(
        error?.response?.data?.message || "Failed to delete existing assessment"
      );
    },
  });

  // Start a new assessment after deleting the existing one
  const startNewAfterDelete = () => {
    startWebAssessment({
      assessment_type: assessmentType,
      abandon_existing: true,
    })
      .then(() => {
        setOpen(false);
        onAssessmentStart();
      })
      .catch((error) => {
        setError(
          error?.response?.data?.message || "Failed to start new assessment"
        );
      });
  };

  const handleStartAssessment = async () => {
    setError(null);
    startMutation.mutate();
  };

  const handleDeleteAndStart = () => {
    if (localSessionId) {
      deleteMutation.mutate(localSessionId);
    }
  };

  const handleResumeExisting = () => {
    console.log("Resume clicked with session:", localSessionId);
    setOpen(false);
    onAssessmentStart(localSessionId);
  };

  const handleStartNew = () => {
    setActiveView("confirm-delete");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Start Assessment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {activeView === "select-type" && (
          <>
            <DialogHeader>
              <DialogTitle>Start New Assessment</DialogTitle>
              <DialogDescription>
                Choose the type of assessment you want to start.
              </DialogDescription>
            </DialogHeader>

            {/* Debugging: Always log the error state */}
            {console.log("Current error state:", error)}

            {/* Ensure the comparison uses toLowerCase() */}
            {error?.toLowerCase() === "active assessment" ? (
              <Alert variant="default" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Active Assessment Found</AlertTitle>
                <AlertDescription>
                  You already have an active assessment session. Would you like to resume or start a new one?
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
            ) : error && error !== "active assessment" ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            {(!hasActiveAssessment ||
              error?.toLowerCase() !== "active assessment") && (
              <RadioGroup
                defaultValue={assessmentType}
                onValueChange={(value) =>
                  setAssessmentType(
                    value as "basic" | "moderate" | "comprehensive"
                  )
                }
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
                  <Label htmlFor="comprehensive">
                    Comprehensive Assessment
                  </Label>
                </div>
              </RadioGroup>
            )}

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              {!hasActiveAssessment &&
                error?.toLowerCase() !== "active assessment" && (
                  <Button
                    onClick={handleStartAssessment}
                    disabled={startMutation.isPending}
                  >
                    {startMutation.isPending ? (
                      <>
                        Starting <Loader className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      "Start Assessment"
                    )}
                  </Button>
                )}
            </DialogFooter>
          </>
        )}

        {activeView === "confirm-delete" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your existing assessment and
                start a new one? This action cannot be undone.
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
              onValueChange={(value) =>
                setAssessmentType(
                  value as "basic" | "moderate" | "comprehensive"
                )
              }
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
                <RadioGroupItem
                  value="comprehensive"
                  id="delete-comprehensive"
                />
                <Label htmlFor="delete-comprehensive">
                  Comprehensive Assessment
                </Label>
              </div>
            </RadioGroup>

            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Starting a new assessment will delete your current progress.
                This action cannot be undone.
              </AlertDescription>
            </Alert>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setActiveView("select-type")}
              >
                Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAndStart}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    Deleting <Loader className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Delete & Start New"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StartAssessmentDialog;