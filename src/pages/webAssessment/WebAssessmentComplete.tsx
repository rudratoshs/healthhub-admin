
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWebAssessment } from '@/hooks/useWebAssessment';
import { Loader } from '@/components/ui/loader';
import { CheckCircle, ArrowRight } from 'lucide-react';

const WebAssessmentComplete: React.FC = () => {
  const { status, statusLoading } = useWebAssessment();
  const navigate = useNavigate();

  // Redirect if not completed
  useEffect(() => {
    if (!statusLoading && status && !status.has_completed_assessment) {
      navigate('/web-assessment/start');
    }
  }, [statusLoading, status, navigate]);

  const handleViewDietPlan = () => {
    navigate('/web-diet-plan');
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
      <div className="max-w-xl mx-auto">
        <Card className="shadow-lg border-green-100">
          <CardHeader className="pb-3 bg-green-50 border-b border-green-100">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full p-3 bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Assessment Complete!</CardTitle>
            <CardDescription className="text-center text-base">
              Thank you for completing your wellness assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-center">
                Based on your responses, we've created a personalized diet plan designed specifically for your needs and goals.
              </p>
              <p className="text-center font-medium">
                Your plan is now ready to view.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button size="lg" onClick={handleViewDietPlan}>
              View Your Diet Plan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WebAssessmentComplete;
