
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWebAssessment } from '@/hooks/useWebAssessment';
import { Loader } from '@/components/ui/loader';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Activity, CheckCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const WebAssessmentStart: React.FC = () => {
  const [assessmentType, setAssessmentType] = React.useState<"basic" | "moderate" | "comprehensive">("moderate");
  const [abandonExisting, setAbandonExisting] = React.useState(false);
  const { status, statusLoading, startAssessment, resumeAssessment, sessionId, loading } = useWebAssessment();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to assessment page if there's an active session
  React.useEffect(() => {
    if (status?.has_active_assessment && sessionId) {
      navigate('/web-assessment/questions');
    }
  }, [status, sessionId, navigate]);

  const handleStart = () => {
    startAssessment(assessmentType, abandonExisting);
  };

  const handleResume = () => {
    if (status?.session_id) {
      resumeAssessment(status.session_id);
      navigate('/web-assessment/questions');
    }
  };

  const handleViewResults = () => {
    navigate('/web-assessment/results');
  };

  if (statusLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Wellness Assessment</h1>
          <p className="text-muted-foreground">
            Complete this assessment to receive a personalized wellness plan
          </p>
        </div>

        {!user && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please log in to start or resume an assessment.
            </AlertDescription>
          </Alert>
        )}

        {status?.has_active_assessment && (
          <Card className="mb-6 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Resume Your Assessment</CardTitle>
              <CardDescription>
                You have an active assessment in progress (started {new Date(status.last_updated).toLocaleDateString()})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Assessment Type</p>
                  <p className="text-muted-foreground capitalize">{status.assessment_type}</p>
                </div>
                <div>
                  <p className="font-medium">Current Phase</p>
                  <p className="text-muted-foreground">{status.current_phase}</p>
                </div>
                <div>
                  <p className="font-medium">Completion</p>
                  <p className="text-muted-foreground">{status.completion_percentage}%</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setAbandonExisting(true)}>
                Start New Assessment
              </Button>
              <Button onClick={handleResume}>
                Resume <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {status?.has_completed_assessment && (
          <Card className="mb-6 shadow-md border-green-100">
            <CardHeader className="pb-3 bg-green-50 border-b border-green-100">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <CardTitle className="text-xl">Assessment Complete</CardTitle>
              </div>
              <CardDescription>
                You have already completed an assessment. You can view your results or start a new one.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setAbandonExisting(true)}>
                Start New Assessment
              </Button>
              <Button onClick={handleViewResults} variant="default">
                View Results <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {(!status?.has_active_assessment || abandonExisting) && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Start New Assessment
              </CardTitle>
              <CardDescription>
                Choose the type of assessment you'd like to complete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                defaultValue={assessmentType} 
                onValueChange={(value) => setAssessmentType(value as "basic" | "moderate" | "comprehensive")}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-3 rounded-lg border">
                  <RadioGroupItem value="basic" id="basic" className="mt-1" />
                  <div className="grid gap-1">
                    <Label htmlFor="basic" className="font-medium">Basic Assessment</Label>
                    <p className="text-sm text-muted-foreground">
                      A quick assessment focusing on essential health metrics. Takes about 5 minutes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg border border-primary bg-primary/5">
                  <RadioGroupItem value="moderate" id="moderate" className="mt-1" />
                  <div className="grid gap-1">
                    <Label htmlFor="moderate" className="font-medium">Moderate Assessment (Recommended)</Label>
                    <p className="text-sm text-muted-foreground">
                      Balanced assessment covering key health and lifestyle factors. Takes about 10 minutes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg border">
                  <RadioGroupItem value="comprehensive" id="comprehensive" className="mt-1" />
                  <div className="grid gap-1">
                    <Label htmlFor="comprehensive" className="font-medium">Comprehensive Assessment</Label>
                    <p className="text-sm text-muted-foreground">
                      In-depth assessment including detailed health history and goals. Takes about 15-20 minutes.
                    </p>
                  </div>
                </div>
              </RadioGroup>

              {status?.has_active_assessment && abandonExisting && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Starting a new assessment will abandon your current progress.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleStart} disabled={loading || !user}>
                {loading ? (
                  <>Starting <Loader className="ml-2" size="sm" /></>
                ) : (
                  <>Start Assessment <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WebAssessmentStart;
