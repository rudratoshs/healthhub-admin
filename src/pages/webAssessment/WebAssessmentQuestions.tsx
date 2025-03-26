import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebAssessment } from '@/hooks/useWebAssessment';
import WebAssessmentQuestion from '@/components/webAssessment/WebAssessmentQuestion';
import WebAssessmentProgress from '@/components/webAssessment/WebAssessmentProgress';
import { Loader } from '@/components/ui/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WebAssessmentQuestions: React.FC = () => {
  const {
    status,
    statusLoading,
    currentQuestion,
    currentResponse,
    sessionId,
    handleResponseChange,
    submitResponse,
    loading,
    validationError,
    isComplete,
    totalPhases,
  } = useWebAssessment();
  const navigate = useNavigate();

  // If assessment is complete, redirect to complete page
  useEffect(() => {
    if (isComplete) {
      navigate('/web-assessment/complete');
    }
  }, [isComplete, navigate]);

  // If no active assessment, redirect to start page
  useEffect(() => {
    if (!statusLoading && status && !status.has_active_assessment) {
      navigate('/web-assessment/start');
    }
  }, [status, statusLoading, navigate]);

  if (statusLoading || !currentQuestion) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="container py-8">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            No active assessment session found. Please start a new assessment.
          </AlertDescription>
          <Button 
            className="mt-4"
            onClick={() => navigate('/web-assessment/start')}
          >
            Go to Start Page
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-6">Wellness Assessment</h1>
        
        {status && (
          <WebAssessmentProgress 
            progress={status.completion_percentage} 
            phase={currentQuestion.phase}
            totalPhases={totalPhases}
          />
        )}
        
        <WebAssessmentQuestion
          question={currentQuestion}
          response={currentResponse}
          onResponseChange={handleResponseChange}
          onSubmit={submitResponse}
          isLoading={loading}
          validationError={validationError}
        />
      </div>
    </div>
  );
};

export default WebAssessmentQuestions;