
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { useWebAssessment } from '@/hooks/useWebAssessment';
import WebAssessmentQuestion from '@/components/webAssessment/WebAssessmentQuestion';
import WebAssessmentProgress from '@/components/webAssessment/WebAssessmentProgress';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const WebAssessmentQuestions: React.FC = () => {
  const {
    currentQuestion,
    currentResponse,
    handleResponseChange,
    submitResponse,
    validationError,
    statusLoading,
    isComplete,
    loading,
    status
  } = useWebAssessment();
  const navigate = useNavigate();

  // Redirect if status is loaded but no active assessment
  useEffect(() => {
    if (!statusLoading && status && !status.has_active_assessment) {
      navigate('/web-assessment/start');
    }
    
    if (isComplete) {
      navigate('/web-assessment/complete');
    }
  }, [statusLoading, status, isComplete, navigate]);

  const handleBack = () => {
    // Navigate back to start page - in a more advanced implementation,
    // this could navigate to the previous question
    navigate('/web-assessment/start');
  };

  if (statusLoading || !currentQuestion) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-center">Wellness Assessment</h1>
        </div>

        {status && (
          <WebAssessmentProgress 
            progress={status.completion_percentage} 
            phase={currentQuestion.phase}
            totalPhases={5} // Assuming 5 phases, adjust as needed
          />
        )}

        <WebAssessmentQuestion
          question={currentQuestion}
          value={currentResponse}
          onChange={handleResponseChange}
          error={validationError}
        />

        <div className="flex justify-between mt-6 max-w-md mx-auto">
          <Button variant="outline" onClick={handleBack} disabled={loading}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={submitResponse} disabled={loading}>
            {loading ? (
              <>Submitting <Loader className="ml-2" size="sm" /></>
            ) : (
              <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebAssessmentQuestions;
