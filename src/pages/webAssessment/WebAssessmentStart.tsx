
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWebAssessment } from '@/hooks/useWebAssessment';
import { Loader } from '@/components/ui/loader';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Activity, CheckCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StartAssessmentDialog from '@/components/webAssessment/StartAssessmentDialog';

const WebAssessmentStart: React.FC = () => {
  const { status, statusLoading, resumeAssessment, loading } = useWebAssessment();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<"basic" | "moderate" | "comprehensive">("moderate");

  // Redirect to assessment page if there's an active session
  React.useEffect(() => {
    if (status?.has_active_assessment && status.session_id) {
      navigate('/web-assessment/questions');
    }
  }, [status, navigate]);

  const handleAssessmentStart = () => {
    if (status?.has_active_assessment && status.session_id) {
      navigate('/web-assessment/questions');
    }
  };

  const handleResumeClick = () => {
    if (status?.session_id) {
      resumeAssessment(status.session_id);
      navigate('/web-assessment/questions');
    }
  };

  const handleViewResults = () => {
    navigate('/web-assessment/results');
  };

  const handleCardSelect = (type: "basic" | "moderate" | "comprehensive") => {
    setSelectedType(type);
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
              <StartAssessmentDialog 
                onAssessmentStart={handleAssessmentStart}
                hasActiveAssessment={true}
                sessionId={status.session_id}
              />
              <Button onClick={handleResumeClick}>
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
              <StartAssessmentDialog 
                onAssessmentStart={handleAssessmentStart}
                hasActiveAssessment={false}
              />
              <Button onClick={handleViewResults} variant="default">
                View Results <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {(!status?.has_active_assessment && !status?.has_completed_assessment) && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Start New Assessment
              </CardTitle>
              <CardDescription>
                Take our wellness assessment to receive a personalized health and nutrition plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our assessment will ask you questions about your health goals, dietary preferences, and lifestyle to create a tailored plan that works for you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card 
                  className={`cursor-pointer transition-colors ${selectedType === "basic" ? "border-primary bg-primary/10" : "bg-primary/5 hover:bg-primary/10"}`}
                  onClick={() => handleCardSelect("basic")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Basic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Quick 5-minute assessment for essential recommendations</p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-colors ${selectedType === "moderate" ? "border-primary bg-primary/10" : "bg-primary/5 hover:bg-primary/10"}`}
                  onClick={() => handleCardSelect("moderate")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Moderate</CardTitle>
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Recommended</span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">10-minute comprehensive health and nutrition assessment</p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-colors ${selectedType === "comprehensive" ? "border-primary bg-primary/10" : "bg-primary/5 hover:bg-primary/10"}`}
                  onClick={() => handleCardSelect("comprehensive")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Comprehensive</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Detailed 15-minute assessment with in-depth analysis</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <StartAssessmentDialog 
                onAssessmentStart={handleAssessmentStart}
              />
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WebAssessmentStart;
